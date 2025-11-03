<template>
  <div class="rambling-publish-container card">
    <!-- 顶部：取消 + 发送 -->
    <div class="top-bar">
      <button class="btn cancel" @click="cancel">取消</button>
      <button class="btn send" @click="publish">发送</button>
    </div>

    <!-- 中部：输入区域 -->
    <textarea v-model="content" class="input" placeholder="写点什么吧..."></textarea>

    <!-- 底部：表情 + 图片上传 -->
    <div class="bottom-bar">
      <button class="icon-btn" @click="insertEmoji">😊 表情</button>
      <button class="icon-btn" @click="triggerImageUpload">
        🖼️ 图片
        <input ref="imageInput" type="file" @change="handleImageUpload" accept="image/*" multiple
          style="display: none" />
      </button>
    </div>

    <!-- 多图预览：网格整齐排列 -->
    <div v-if="imageUrls.length > 0" class="preview-grid">
      <div class="preview-item" v-for="(url, index) in imageUrls" :key="index">
        <img :src="url" alt="图片预览" class="preview-img" />
        <button class="delete-btn" @click="removeImage(index)">×</button>
      </div>
    </div>
  </div>
</template>

<script>
import parseToken from '../../../../util/parseToken';
import { Notification } from 'element-ui';
import { mapActions } from 'vuex';
import OSS from 'ali-oss';
import request from '../../../../api/request';

export default {
  name: 'PostEditor',
  data() {
    return {
      content: '',
      imageUrls: [], // 改为数组存储多张图片链接
      userInfo: {},
      maxImageCount: 9 // 限制最多上传6张图（可调整）
    };
  },
  mounted() {
    this.initUserInfo();
  },
  methods: {
    ...mapActions('rambling', ['rambling_post', 'rambling_get']),
    ...mapActions('user', ['user_get', 'user_post']),

    initUserInfo() {
      const token = localStorage.getItem('token');
      if (token) {
        const { id, name, avatar } = parseToken(token);
        this.userInfo = { id, name, avatar };
      }
    },

    cancel() {
      this.content = '';
      this.imageUrls = []; // 清空多图数组
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },

    async publish() {
      const { id } = parseToken(localStorage.getItem('token'));
      if (!this.content.trim() && this.imageUrls.length === 0) {
        return Notification({ type: 'warning', message: '请输入内容或上传图片' });
      }

      const payload = { user_id: id, content: this.content };
      const rambling_id = await this.sendRamblings(payload);

      // 多图提交：传递图片链接数组
      if (rambling_id && this.imageUrls.length > 0) {
        await this.sendPhotos({ rambling_id, imgs: this.imageUrls });
      }

      this.cancel();
      await this.rambling_get('/api/get_ramblings');
    },

    async sendRamblings(payload) {
      try {
        const res = await this.rambling_post({ url: '/api/publish_rambling', payload });
        Notification({
          type: res.code === 200 ? 'success' : 'error',
          message: res.msg
        });
        return res.code === 200 ? res.rambling_id : null;
      } catch (err) {
        console.error('发布碎碎念失败:', err);
        Notification({ type: 'error', message: '发布碎碎念失败' });
        return null;
      }
    },

    async sendPhotos(payload) {
      try {
        const res = await this.rambling_post({ url: '/api/publish_photos', payload });
        if (res.code === 200) {
          Notification({ type: 'success', message: '图片提交成功' });
        } else {
          Notification({ type: 'error', message: '图片提交失败: ' + res.msg });
        }
      } catch (err) {
        console.error('图片提交失败:', err);
        Notification({ type: 'error', message: '图片提交失败' });
      }
    },

    insertEmoji() {
      this.content += '😊';
    },

    triggerImageUpload() {
      if (!this.userInfo.id) {
        return Notification({ type: 'warning', message: '请先登录' });
      }
      // 检查是否已达最大上传数量
      if (this.imageUrls.length >= this.maxImageCount) {
        return Notification({ type: 'warning', message: `最多只能上传${this.maxImageCount}张图片` });
      }
      this.$refs.imageInput?.click();
    },

    // 处理多图上传
    async handleImageUpload(e) {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // 过滤超出最大数量的图片
      const uploadFiles = Array.from(files).slice(0, this.maxImageCount - this.imageUrls.length);
      if (uploadFiles.length === 0) {
        return Notification({ type: 'warning', message: `最多只能上传${this.maxImageCount}张图片` });
      }

      try {
        // 1. 获取OSS凭证（只请求一次，复用凭证）
        const stsRes = await request.get('/api/oss/sts');
        if (stsRes.code !== 200 || !stsRes.data) {
          throw new Error('获取上传凭证失败');
        }
        const stsData = stsRes.data;

        // 2. 初始化OSS客户端
        const client = new OSS({
          region: stsData.Region,
          accessKeyId: stsData.AccessKeyId,
          accessKeySecret: stsData.AccessKeySecret,
          stsToken: stsData.SecurityToken,
          bucket: stsData.Bucket,
          secure: true,
          refreshSTSToken: async () => {
            const res = await this.user_get({ url: '/api/oss/sts' });
            return {
              accessKeyId: res.data.AccessKeyId,
              accessKeySecret: res.data.AccessKeySecret,
              stsToken: res.data.SecurityToken
            };
          },
          refreshSTSTokenInterval: 300000
        });

        Notification({ type: 'info', message: `正在上传${uploadFiles.length}张图片...` });

        // 3. 批量上传图片（并行处理）
        const uploadPromises = uploadFiles.map(async (file) => {
          // 校验单张图片大小
          const maxSize = 5 * 1024 * 1024; // 5MB/张
          if (file.size > maxSize) {
            throw new Error(`${file.name} 大小超过5MB，无法上传`);
          }

          // 构建唯一上传路径（防重名）
          const timestamp = new Date().getTime();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const fileExt = file.name.split('.').pop().toLowerCase();
          const objectName = `uploads/tassamib/ramblings/${this.userInfo.name}/${timestamp}_${randomStr}.${fileExt}`;

          // 执行上传
          const uploadResult = await client.put(objectName, file, {
            contentType: this.getImageType(file.name),
            timeout: 60000
          });
          return uploadResult.url;
        });

        // 4. 收集上传成功的图片链接
        const newImageUrls = await Promise.all(uploadPromises);
        this.imageUrls = [...this.imageUrls, ...newImageUrls]; // 合并到数组

        Notification({ type: 'success', message: `成功上传${newImageUrls.length}张图片` });

      } catch (err) {
        console.error('图片上传失败:', err.message);
        Notification({ type: 'error', message: '图片上传失败: ' + err.message });
      } finally {
        // 清空文件选择框，避免重复上传
        this.$refs.imageInput.value = '';
      }
    },

    getImageType(fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase() || '';
      const typeMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml'
      };
      return typeMap[ext] || 'image/jpeg';
    },

    // 按索引删除图片
    removeImage(index) {
      this.imageUrls.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.rambling-publish-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin: 0 auto;
  gap: 12px;
}

/* 顶部按钮 */
.top-bar {
  display: flex;
  justify-content: space-between;
}

.btn {
  font-size: 14px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
}

.cancel {
  color: #999;
}

.cancel:hover {
  color: #666;
  background-color: #f5f5f5;
}

.send {
  color: #ffffff;
  background-color: #6db4f5;
}

.send:hover {
  background-color: #59a6f9;
}

/* 输入区域 */
.input {
  min-height: 100px;
  font-size: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  color: #333;
}

.input:focus {
  outline: none;
  border-color: #6db4f5;
  box-shadow: 0 0 0 2px rgba(109, 180, 245, 0.1);
}

/* 底部功能按钮 */
.bottom-bar {
  display: flex;
  gap: 16px;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
}

.icon-btn:hover {
  color: #6db4f5;
  background-color: #f0f7ff;
}

/* 多图预览网格：整齐排列 */
.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.preview-item {
  position: relative;
  width: 100px;
  /* 固定宽度，确保整齐 */
  height: 100px;
  /* 固定高度，正方形展示 */
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 保持图片比例，填充容器 */
}

/* 预览图删除按钮 */
.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff4d4f;
  color: white;
  border: none;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s;
  z-index: 10;
}

.delete-btn:hover {
  background-color: #ff7875;
}
</style>