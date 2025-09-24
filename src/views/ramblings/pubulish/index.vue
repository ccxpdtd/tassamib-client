<template>
  <div class="rambling-publish-container card">
    <!-- 顶部：取消 + 发送 -->
    <div class="top-bar">
      <button class="btn cancel" @click="cancel">取消</button>
      <button class="btn send" @click="submit">发送</button>
    </div>

    <!-- 中部：输入区域 -->
    <textarea v-model="content" class="input" placeholder="写点什么吧..."></textarea>

    <!-- 底部：表情 + 图片上传 -->
    <div class="bottom-bar">
      <button class="icon-btn" @click="insertEmoji">😊 表情</button>
      <label class="icon-btn">
        🖼️ 图片
        <input type="file" @change="uploadImage" accept="image/*" style="display:none" />
      </label>
    </div>

    <!-- 可选：预览上传的图片 -->
    <div v-if="imageUrl" class="preview">
      <img :src="imageUrl" alt="预览" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostEditor',
  data() {
    return {
      content: '',
      imageUrl: ''
    }
  },

  methods: {
    cancel() {
      this.content = ''
      this.imageUrl = ''
    },
    submit() {
      if (!this.content.trim()) {
        alert('内容不能为空')
        return
      }
      const payload = {
        content: this.content,
        img: this.imageUrl,
      }

      this.$store.dispatch('post', { url: '/api/publish_rambling', payload })
      this.$store.dispatch('get', '/api/get_ramblings')

      this.cancel()
    },
    insertEmoji() {
      this.content += '😊'
    },
    uploadImage(event) {
      const file = event.target.files[0]
      if (file) {
        this.imageUrl = URL.createObjectURL(file)
      }
    }
  }
}
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

/* 底部功能按钮 */
.bottom-bar {
  display: flex;
  gap: 16px;
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
}

/* 预览图片 */
.preview {
  margin-top: 10px;
}

.preview img {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid #eee;
}
</style>
