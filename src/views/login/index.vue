<template>
  <div class="form-container">
    <!-- 切换登录/注册标题 -->
    <div class="tab-header">
      <button class="tab-btn" :class="{ active: isLogin }" @click="switchToLogin">
        登录
      </button>
      <button class="tab-btn" :class="{ active: !isLogin }" @click="switchToRegister">
        注册
      </button>
    </div>

    <!-- 表单主体 -->
    <form class="modern-form" @submit.prevent="handleSubmit">
      <div class="form-title">{{ isLogin ? '登录' : '注册' }}</div>

      <div class="form-body">
        <!-- 用户名输入框：仅在「密码登录」或「注册」时显示 -->
        <div class="input-group" v-if="!isLogin || (isLogin && loginMethod === 'password')">
          <div class="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" class="input-icon">
              <circle stroke-width="1.5" stroke="currentColor" r="4" cy="8" cx="12"></circle>
              <path stroke-linecap="round" stroke-width="1.5" stroke="currentColor"
                d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20"></path>
            </svg>
            <input required placeholder="用户名" class="form-input" type="text" v-model="form.name" />
          </div>
        </div>

        <!-- 邮箱输入框：验证码登录/注册时显示 -->
        <div class="input-group" v-if="!isLogin || (isLogin && loginMethod === 'verifyCode')">
          <div class="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" class="input-icon">
              <path stroke-width="1.5" stroke="currentColor"
                d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z">
              </path>
            </svg>
            <input required placeholder="邮箱" class="form-input" type="email" v-model="form.email" />
          </div>
        </div>

        <!-- 密码输入框：密码登录/注册时显示 -->
        <div class="input-group" v-if="!isLogin || (isLogin && loginMethod === 'password')">
          <div class="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" class="input-icon">
              <path stroke-width="1.5" stroke="currentColor"
                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z">
              </path>
            </svg>
            <input required placeholder="密码" class="form-input" :type="showPwd ? 'text' : 'password'"
              v-model="form.password" />
            <button class="password-toggle" type="button" @click="togglePwd">
              <svg fill="none" viewBox="0 0 24 24" class="eye-icon">
                <path stroke-width="1.5" stroke="currentColor"
                  d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"></path>
                <circle stroke-width="1.5" stroke="currentColor" r="3" cy="12" cx="12"></circle>
              </svg>
            </button>
          </div>
        </div>

        <!-- 确认密码输入框：仅注册时显示 -->
        <div class="input-group" v-if="!isLogin">
          <div class="input-wrapper">
            <svg fill="none" viewBox="0 0 24 24" class="input-icon">
              <path stroke-width="1.5" stroke="currentColor"
                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z">
              </path>
            </svg>
            <input required placeholder="确认密码" class="form-input" :type="showConfirmPwd ? 'text' : 'password'"
              v-model="form.confirmpassword" />
            <button class="password-toggle" type="button" @click="toggleConfirmPwd">
              <svg fill="none" viewBox="0 0 24 24" class="eye-icon">
                <path stroke-width="1.5" stroke="currentColor"
                  d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"></path>
                <circle stroke-width="1.5" stroke="currentColor" r="3" cy="12" cx="12"></circle>
              </svg>
            </button>
          </div>
        </div>

        <!-- 验证码输入框：验证码登录/注册时显示 -->
        <div class="input-group" v-if="!isLogin || (isLogin && loginMethod === 'verifyCode')">
          <div class="verify-code-wrapper">
            <div class="input-wrapper">
              <svg fill="none" viewBox="0 0 24 24" class="input-icon">
                <path stroke-width="1.5" stroke="currentColor"
                  d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z">
                </path>
              </svg>
              <input required placeholder="请输入验证码" class="form-input verify-code-input" type="text"
                v-model="form.verifyCode" maxlength="6" />
            </div>
            <button type="button" class="send-code-btn" :disabled="isSendingCode" @click="handleSendCode">
              {{ isSendingCode ? `${countdown}s后重新发送` : '发送验证码' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 登录方式切换小字 -->
      <div v-if="isLogin" class="login-method-switch-container">
        <span class="login-method-switch" @click="switchLoginMethod">
          {{ loginMethod === 'password' ? '使用验证码登录' : '使用密码登录' }}
        </span>
      </div>

      <!-- 提交按钮 -->
      <button class="submit-button" type="submit">
        <span class="button-text">
          {{ isLogin ? (loginMethod === 'password' ? '密码登录' : '验证码登录') : '注册' }}
        </span>
        <div class="button-glow"></div>
      </button>

    </form>
  </div>
</template>

<script>
import { Notification } from 'element-ui';
import { mapActions } from 'vuex';

export default {
  name: 'LoginRegister',
  data() {
    return {
      isLogin: true,
      loginMethod: 'password',
      showPwd: false,
      showConfirmPwd: false,
      isSendingCode: false,
      countdown: 60,
      countdownTimer: null,
      form: {
        name: '',
        email: '',
        password: '',
        confirmpassword: '',
        verifyCode: ''
      },
      // 统一校验规则配置：按场景分类
      validationRules: {
        // 密码登录：用户名 + 密码
        passwordLogin: [
          { key: 'name', rule: (val) => val.trim(), message: '用户名不能为空' },
          { key: 'password', rule: (val) => val.trim(), message: '密码不能为空' },
          { key: 'password', rule: (val) => val.length >= 6, message: '密码长度不能少于6位' }
        ],
        // 验证码登录：邮箱 + 验证码
        verifyLogin: [
          { key: 'email', rule: (val) => val.trim(), message: '邮箱不能为空' },
          { key: 'email', rule: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), message: '请输入有效的邮箱地址' },
          { key: 'verifyCode', rule: (val) => val.trim(), message: '请输入验证码' },
          { key: 'verifyCode', rule: (val) => val.length === 6, message: '验证码长度必须为6位' }
        ],
        // 注册：用户名 + 邮箱 + 密码 + 确认密码 + 验证码
        register: [
          { key: 'name', rule: (val) => val.trim(), message: '用户名不能为空' },
          { key: 'email', rule: (val) => val.trim(), message: '邮箱不能为空' },
          { key: 'email', rule: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), message: '请输入有效的邮箱地址' },
          { key: 'password', rule: (val) => val.trim(), message: '密码不能为空' },
          { key: 'password', rule: (val) => val.length >= 6, message: '密码长度不能少于6位' },
          { key: 'confirmpassword', rule: (val) => val.trim(), message: '确认密码不能为空' },
          { key: 'confirmpassword', rule: (val) => val === this.form.password, message: '两次输入的密码不一致' },
          { key: 'verifyCode', rule: (val) => val.trim(), message: '请输入验证码' },
          { key: 'verifyCode', rule: (val) => val.length === 6, message: '验证码长度必须为6位' }
        ],
        // 发送验证码：仅校验邮箱
        sendCode: [
          { key: 'email', rule: (val) => val.trim(), message: '请先输入邮箱' },
          { key: 'email', rule: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), message: '请输入有效的邮箱地址' }
        ]
      }
    };
  },
  mounted() {
    this.resetForm();
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  methods: {
    ...mapActions('user', ['user_post', 'user_get']),

    switchToLogin() {
      this.isLogin = true;
      this.loginMethod = 'password';
      this.resetForm();
    },

    switchToRegister() {
      this.isLogin = false;
      this.resetForm();
    },

    switchLoginMethod() {
      this.loginMethod = this.loginMethod === 'password' ? 'verifyCode' : 'password';
      this.form = { ...this.form, name: '', password: '', verifyCode: '' }; // 清空切换时的冗余字段
    },

    togglePwd() {
      this.showPwd = !this.showPwd;
    },

    toggleConfirmPwd() {
      this.showConfirmPwd = !this.showConfirmPwd;
    },

    resetForm() {
      this.form = { name: '', email: '', password: '', confirmpassword: '', verifyCode: '' };
      this.showPwd = this.showConfirmPwd = false;
      this.isSendingCode = false;
      this.countdown = 60;
      if (this.countdownTimer) clearInterval(this.countdownTimer);
    },

    // 通用校验函数：接收校验规则名称，返回是否通过
    validateForm(ruleName) {
      const rules = this.validationRules[ruleName];
      for (const { key, rule, message } of rules) {
        const value = this.form[key];
        if (!rule(value)) {
          Notification({ type: 'error', message });
          return false;
        }
      }
      return true;
    },

    // 发送验证码：仅校验邮箱
    async handleSendCode() {
      // 触发邮箱校验
      if (!this.validateForm('sendCode')) return;
      this.isSendingCode = true;

      const url = `/api/sendCode`
      const payload = {
        email: this.form.email.trim(),
        method: this.isLogin ? 'login' : 'register'
      }

      try {
        const res = await this.user_post({ url, payload });
        Notification({ type: res.code === 200 ? 'success' : 'error', message: res.msg });
        if (res.code === 200) {
          this.countdownTimer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
              clearInterval(this.countdownTimer);
              this.isSendingCode = false;
              this.countdown = 60;
            }
          }, 1000);
        } else {
          this.isSendingCode = false;
        }
      } catch (err) {
        console.error('发送验证码失败：', err);
        Notification({ type: 'error', message: '网络异常，验证码发送失败' });
        this.isSendingCode = false;
      }
    },

    // 提交表单：根据场景触发对应校验
    async handleSubmit() {
      // 1. 确定当前场景的校验规则
      let ruleName;
      if (this.isLogin) {
        ruleName = this.loginMethod === 'password' ? 'passwordLogin' : 'verifyLogin';
      } else {
        ruleName = 'register';
      }

      // 2. 触发校验，不通过则终止
      if (!this.validateForm(ruleName)) return;

      // 3. 构造请求参数
      const { name, email, password, verifyCode } = this.form;
      let url, payload;
      if (this.isLogin) {
        if (this.loginMethod === 'password') {
          url = '/api/login';
          payload = { name: name.trim(), password: password.trim(), method: 'login' };
        } else {
          url = '/api/loginByVerifyCode';
          payload = { email: email.trim(), code: verifyCode.trim(), method: 'login' };
        }
      } else {
        url = '/api/register';
        payload = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          code: verifyCode.trim()
        };
      }


      // 4. 发送请求
      try {
        const res = await this.user_post({ url, payload });
        if (res.code === 200) {
          this.resetForm();
          if (this.isLogin && res.token) localStorage.setItem('token', res.token);
          this.isLogin && this.$router.push('/');
          !this.isLogin && this.switchToLogin();
          Notification({ type: 'success', message: res.msg });
        } else {
          Notification({ type: 'error', message: res.msg || '操作失败，请重试' });
        }
      } catch (err) {
        const action = this.isLogin
          ? (this.loginMethod === 'password' ? '密码登录' : '验证码登录')
          : '注册';
        console.error(`${action}请求失败：`, err);
        Notification({ type: 'error', message: '网络异常，请检查连接后重试' });
      }
    }
  }
};
</script>

<style scoped>
/* 表单容器：控制整体居中 */
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #f9fafb;
}

/* 切换标签样式 */
.tab-header {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
}

.tab-btn {
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.tab-btn:hover:not(.active) {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

/* 表单主体样式 */
.modern-form {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --primary-light: rgba(59, 130, 246, 0.1);
  --success: #10b981;
  --text-main: #1e293b;
  --text-secondary: #64748b;
  --bg-input: #f8fafc;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;

  position: relative;
  width: 320px;
  padding: 28px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(148, 163, 184, 0.1);
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  box-sizing: border-box;
}

.form-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 24px;
  text-align: center;
  letter-spacing: -0.01em;
}

.input-group {
  margin-bottom: 18px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 36px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: var(--bg-input);
  color: var(--text-main);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

/* 仅保留必要的自动填充样式（避免 ESLint 误判） */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 40px var(--bg-input) inset !important;
  -webkit-text-fill-color: var(--text-main) !important;
}

.form-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.8;
}

.input-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.eye-icon {
  width: 18px;
  height: 18px;
}

/* 验证码输入框 + 发送按钮容器 */
.verify-code-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.verify-code-input {
  padding: 0 32px !important;
}

/* 发送验证码按钮样式 */
.send-code-btn {
  height: 44px;
  padding: 0 16px;
  background: var(--bg-input);
  border: 1px solid var(--gray-200);
  border-radius: 10px;
  font-size: 13px;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.send-code-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  background-color: var(--primary-light);
}

.send-code-btn:disabled {
  cursor: not-allowed;
  background-color: #f1f5f9;
  border-color: var(--gray-300);
  color: var(--text-secondary);
  opacity: 0.8;
}

/* 登录方式切换小字样式 */
.login-method-switch-container {
  text-align: right;
  margin: 8px 0 12px;
}

.login-method-switch {
  font-size: 12px;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-method-switch:hover {
  color: var(--primary-dark);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* 提交按钮 */
.submit-button {
  position: relative;
  width: 100%;
  height: 44px;
  margin-top: 0;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
}

.toggle-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.toggle-link span {
  color: var(--primary);
  font-weight: 500;
}

/* Hover & Focus 状态 */
.form-input:hover {
  border-color: #cbd5e1;
  background-color: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 4px var(--primary-light);
}

.password-toggle:hover {
  color: var(--primary);
  transform: scale(1.1);
}

.password-toggle:active {
  transform: scale(0.95);
}

.submit-button:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(59, 130, 246, 0.25),
    0 2px 4px rgba(59, 130, 246, 0.15);
}

.submit-button:hover .button-glow {
  transform: translateX(100%);
}

.submit-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
}

.toggle-link:hover {
  color: var(--text-main);
}

.toggle-link:hover span {
  color: var(--primary-dark);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* 表单验证状态 */
.form-input:not(:placeholder-shown):valid {
  border-color: var(--success);
}

.form-input:not(:placeholder-shown):valid~.input-icon {
  color: var(--success);
}

.form-input:not(:placeholder-shown):invalid {
  border-color: #ef4444;
  animation: shake 0.2s ease-in-out;
}

.form-input:not(:placeholder-shown):invalid~.input-icon {
  color: #ef4444;
}

/* 抖动动画 */
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
}

/* 适配移动端 */
@media (max-width: 375px) {
  .modern-form {
    width: 100%;
    padding: 24px;
  }

  .verify-code-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .send-code-btn {
    width: 100%;
  }
}
</style>