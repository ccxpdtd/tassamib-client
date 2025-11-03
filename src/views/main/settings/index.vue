<template>
  <div class="settings-page">
    <!-- 顶部：头像 + 用户信息 -->
    <div class="userInfo-header">
      <div class="avatar-box">
        <!-- 隐藏的文件选择框 -->
        <input ref="avatarInput" type="file" accept="image/*" style="display: none" @change="handleAvatarUpload" />

        <!-- 点击触发选择文件 -->
        <img :src="userInfo.avatar || 'https://pic.616pic.com/ys_img/00/06/27/5m1AgeRLf3.jpg'" alt="avatar"
          class="avatar" @click="triggerAvatarInput" />
        <button class="change-avatar" @click="triggerAvatarInput">更换头像</button>
      </div>

      <div class="user-info">
        <h2>{{ userInfo.name }}</h2>
        <p>{{ userInfo.email || 'error' }}</p>
      </div>
    </div>

    <!-- 个人资料 -->
    <div class="settings-card">
      <h3>个人资料</h3>
      <div class="form-grid">
        <div class="form-item">
          <label>昵称</label>
          <input v-model="userInfo.name" type="text" placeholder="请输入昵称" />
        </div>
        <div class="form-item">
          <label>性别</label>
          <select v-model="userInfo.gender">
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="unknown">其他</option>
          </select>
        </div>
        <div class="form-item">
          <label>生日</label>
          <input v-model="userInfo.birthday" type="date" />
        </div>
      </div>
      <div class="form-actions">
        <button class="save-btn" @click="saveUserInfo">保存修改</button>
      </div>
    </div>

    <!-- 账号安全 -->
    <div class="settings-card">
      <h3>账号安全</h3>
      <div class="security-list">
        <div class="security-item">
          <span class="label">邮箱</span>
          <span class="value">{{ userInfo.email || 'error' }}</span>
          <button class="action-btn" @click="showEmailModal = true">修改</button>
        </div>
        <div class="security-item">
          <span class="label">密码</span>
          <span class="value">********</span>
          <button class="action-btn" @click="showPasswordModal = true">修改</button>
        </div>
      </div>
    </div>

    <!-- 修改邮箱弹窗 -->
    <div v-if="showEmailModal" class="modal">
      <div class="modal-content">
        <h3>修改邮箱</h3>
        <div class="input-group">
          <input v-model="emailForm.newEmail" type="email" placeholder="新邮箱地址" />
        </div>
        <div class="code-row">
          <div class="input-group">
            <input v-model="emailForm.code" type="text" placeholder="验证码" />
          </div>
          <button class="send-code" :disabled="countdown > 0" @click="sendCode">
            {{ countdown > 0 ? countdown + 's' : '发送验证码' }}
          </button>
        </div>
        <div class="modal-actions">
          <button @click="updateEmail">确认</button>
          <button @click="showEmailModal = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <h3>修改密码</h3>
        <div class="input-group">
          <input v-model="passwordForm.oldPassword" type="password" placeholder="旧密码" />
          <input v-model="passwordForm.newPassword" type="password" placeholder="新密码" />
          <input v-model="passwordForm.confirmPassword" type="password" placeholder="确认新密码" />
        </div>
        <div class="modal-actions">
          <button @click="updatePassword">确认</button>
          <button @click="showPasswordModal = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 仅引入必要依赖（无 Vuex）
import parseToken from '../../../util/parseToken'
import { formatDate } from '../../../util/format/index'
import OSS from 'ali-oss'
import request from '../../../api/request'
import { mapActions } from 'vuex'
import { Notification } from 'element-ui'
export default {
  name: 'SettingsPage',
  data() {
    return {
      userInfo: {},
      // 弹窗控制
      showEmailModal: false,
      showPasswordModal: false,
      // 表单数据
      emailForm: {
        newEmail: '',
        code: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      // 倒计时
      countdown: 0,
      timer: null,
      // 头像上传DOM引用
      avatarInput: null
    }
  },
  mounted() {
    // 页面加载时获取用户信息
    this.getUserInfo()
  },
  methods: {
    ...mapActions('user', ['user_get', 'user_post']),
    async getUserInfo() {
      const { id } = parseToken(localStorage.getItem('token'))
      const url = `/api/get_myInfo`
      const payload = { id }
      const res = await this.user_get({ url, payload })
      if (res.code === 200)
        this.userInfo = { ...res.userInfo, birthday: formatDate(res.userInfo.birthday) }
      else
        Notification({ type: 'error', message: res.msg })
    },


    // -----------------------------图床-------------------------
    //#region
    // 触发文件选择框点击
    triggerAvatarInput() {
      this.$refs.avatarInput?.click();
    },

    // 处理头像上传
    async handleAvatarUpload(e) {
      try {
        const file = e.target.files?.[0];
        if (!file) throw new Error('未选择文件');

        // 1. 请求STS凭证
        const stsRes = await request.get('/api/oss/sts');
        if (stsRes.code !== 200 || !stsRes.data)
          throw new Error('STS 返回数据异常: ' + (stsRes.msg || '未知错误'));
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

        // 3. 上传路径 + 图片类型
        const objectName = `uploads/tassamib/avatar/${this.userInfo.name}/${file.name}`;
        const imageMimeType = this.getImageType(file.name);

        // 4. 执行上传 + 更新头像
        const uploadResult = await client.put(objectName, file, { contentType: imageMimeType });
        await this.changeAvatar(uploadResult.url);

      } catch (err) {
        console.error('上传失败:', err.message);
        Notification({
          type: 'error',
          message: '头像上传失败: ' + (err.message || '未知错误')
        });
      }
    },

    // 更新头像到数据库
    async changeAvatar(avatar_url) {
      const data = await this.user_post({
        url: '/api/change_avatar',
        payload: {
          id: this.userInfo.id,
          avatar: avatar_url
        }
      });

      if (data.code === 200) {
        this.userInfo.avatar = avatar_url;
        Notification({ type: 'success', message: data.msg });
      } else {
        Notification({ type: 'error', message: data.msg });
      }
    },

    // 识别图片类型
    getImageType(fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase() || '';
      const typeMap = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp'
      };
      return typeMap[ext] || 'image/jpeg';
    },
    //#endregion
    //---------------------------------------------------


    /* 保存个人资料 */
    async saveUserInfo() {
      if (!this.userInfo.name) {
        Notification({ type: 'warning', message: '昵称不能为空' })
        return
      }
      const url = `/api/change_myinfo`
      const payload = {
        id: this.userInfo.id,
        name: this.userInfo.name,
        gender: this.userInfo.gender,
        birthday: this.userInfo.birthday
      }
      const res = await this.user_post({ url, payload })
      Notification({
        type: res.code === 200 ? 'success' : 'error',
        message: res.msg
      })
    },

    /* 发送邮箱验证码 */
    async sendCode() {
      const email = this.emailForm.newEmail.trim()
      if (!email) {
        Notification({ type: 'warning', message: '请输入新邮箱' })
        return
      }
      // 简单邮箱格式验证
      const emailReg = /^[\w.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/
      if (!emailReg.test(email)) {
        Notification({ type: 'warning', message: '请输入有效邮箱地址' })
        return
      }
      const url = `/api/sendCode`
      const payload = { email, method: 'changeEmail' }
      const res = await this.user_post({ url, payload })
      if (res.code === 200) {
        Notification({ type: 'success', message: res.msg })
        // 启动倒计时
        this.countdown = 60
        this.timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      } else {
        Notification({ type: 'error', message: res.msg })
      }

    },

    /* 修改邮箱 */
    async updateEmail() {
      const { newEmail, code } = this.emailForm
      if (!newEmail.trim()) {
        Notification({ type: 'warning', message: '请输入新邮箱' })
        return
      }
      if (!code.trim()) {
        Notification({ type: 'warning', message: '请输入验证码' })
        return
      }
      const url = `/api/change_email`
      const payload = {
        id: this.userInfo.id,
        email: newEmail,
        code: code
      }
      const res = await this.user_post({ url, payload })
      if (res.code === 200) {
        Notification({ type: 'success', message: res.msg })
        this.goToLogin()
      } else {
        Notification({ type: 'error', message: res.msg })
      }
    },

    /* 修改密码 */
    async updatePassword() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm
      if (!oldPassword.trim()) {
        Notification({ type: 'warning', message: '请输入旧密码' })
        return
      }
      if (!newPassword.trim()) {
        Notification({ type: 'warning', message: '请输入新密码' })
        return
      }
      if (newPassword.length < 6) {
        Notification({ type: 'warning', message: '新密码长度不能少于6位' })
        return
      }
      if (newPassword !== confirmPassword) {
        Notification({ type: 'warning', message: '两次输入的新密码不一致' })
        return
      }
      const url = `/api/change_password`
      const payload = {
        id: this.userInfo.id,
        password: oldPassword,
        newPassword: newPassword
      }
      const res = await this.user_post({ url, payload })
      if (res.code === 200) {
        Notification({ type: 'success', message: res.msg })
        this.goToLogin()
      } else {
        Notification({ type: 'error', message: res.msg })
      }
    },

    /* 退出登录并跳转 */
    goToLogin() {
      // 清空表单和弹窗状态
      this.showEmailModal = false
      this.showPasswordModal = false
      this.emailForm.newEmail = ''
      this.emailForm.code = ''
      this.passwordForm.oldPassword = ''
      this.passwordForm.newPassword = ''
      this.passwordForm.confirmPassword = ''
      // 清除倒计时
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
        this.countdown = 0
      }
      // 清除token并跳转登录页
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  beforeDestroy() {
    // 组件销毁时清除倒计时
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
/* 全局容器 - 透明背景 */
.settings-page {
  width: 90%;
  max-width: 720px;
  margin: 40px auto;
  color: #333;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background: transparent;
  padding-bottom: 60px;
}

/* 顶部头像区域 */
.userInfo-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
  background: transparent;
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid #eee;
  object-fit: cover;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.change-avatar {
  margin-top: 8px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.change-avatar:hover {
  background: #e9ecef;
  color: #343a40;
  border-color: #adb5bd;
}

.user-info h2 {
  font-size: 22px;
  margin-bottom: 4px;
  color: #212529;
  font-weight: 600;
}

.user-info p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

/* 设置卡片样式 - 半透明白色 */
.settings-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
  transition: box-shadow 0.3s ease;
}

.settings-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.settings-card h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  border-left: 3px solid #4299e1;
  padding-left: 12px;
  color: #212529;
  font-weight: 600;
}

/* 表单网格布局 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 576px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item label {
  margin-bottom: 4px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
}

.form-item input,
.form-item select {
  background: #fff;
  border: 1px solid #ced4da;
  color: #212529;
  border-radius: 8px;
  padding: 11px 14px;
  outline: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.form-item input:focus,
.form-item select:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  outline: none;
}

.form-item input::placeholder {
  color: #adb5bd;
}

/* 表单操作按钮区域 */
.form-actions {
  text-align: right;
}

.save-btn {
  background: #4299e1;
  border: none;
  color: #fff;
  padding: 9px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.save-btn:hover {
  background: #3182ce;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.2);
}

.save-btn:active {
  transform: scale(0.98);
}

/* 账号安全列表 */
.security-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 8px;
  padding: 14px 16px;
  border: 1px solid #f1f3f5;
  transition: all 0.3s ease;
}

.security-item:hover {
  border-color: #e9ecef;
  background: #f8f9fa;
}

.security-item .label {
  color: #212529;
  font-size: 14px;
  font-weight: 500;
}

.security-item .value {
  color: #6c757d;
  font-size: 14px;
  flex: 1;
  margin: 0 16px;
  text-align: center;
}

.action-btn {
  background: #4299e1;
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.action-btn:hover {
  background: #3182ce;
  box-shadow: 0 2px 6px rgba(66, 153, 225, 0.2);
}

/* 弹窗样式 */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(0.5px);
  transition: background 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #e9ecef;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #212529;
  font-weight: 600;
  border-left: 3px solid #4299e1;
  padding-left: 12px;
}

/* 输入组样式 */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group input {
  background: #fff;
  border: 1px solid #ced4da;
  color: #212529;
  border-radius: 8px;
  padding: 11px 14px;
  outline: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.input-group input:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.input-group input::placeholder {
  color: #adb5bd;
}

/* 验证码行样式 */
.code-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.code-row .input-group {
  flex: 1;
}

.send-code {
  width: 120px;
  background: #4299e1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  text-align: center;
}

.send-code:hover:not(:disabled) {
  background: #3182ce;
  box-shadow: 0 2px 6px rgba(66, 153, 225, 0.2);
}

.send-code:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

/* 弹窗操作按钮 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.modal-actions button {
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.modal-actions button:first-child {
  background: #4299e1;
  border: none;
  color: #fff;
}

.modal-actions button:first-child:hover {
  background: #3182ce;
  box-shadow: 0 2px 6px rgba(66, 153, 225, 0.2);
}

.modal-actions button:last-child {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #6c757d;
}

.modal-actions button:last-child:hover {
  background: #e9ecef;
  color: #343a40;
  border-color: #adb5bd;
}

/* 适配移动端 */
@media (max-width: 480px) {
  .userInfo-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .security-item .value {
    margin: 0;
    text-align: left;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    margin-top: 4px;
  }

  .code-row {
    flex-direction: column;
    gap: 12px;
  }

  .send-code {
    width: 100%;
  }
}
</style>