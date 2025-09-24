<template>
  <div class="container" @submit.prevent="handleSubmit">

    <form class="form">

      <p class="heading">{{ isLogin ? 'Login' : 'Register' }}</p>

      <input type="text" class="input" v-model="form.uname" placeholder="Username" required minlength="1">
      <input class="input" type='password' placeholder="Password" v-model="form.psw" required minlength="6">

      <!-- 注册时显示确认密码 -->
      <input v-if="!isLogin" class="input" type="password" placeholder="Confirm Password" v-model="form.confirmPsw"
        required minlength="6" />

      <!-- 切换登录/注册 -->
      <p class="login-or-register" @click="isLogin = false" v-if="isLogin">
        rigister
      </p>
      <p class="login-or-register" @click="isLogin = true" v-else>
        login
      </p>

      <button class="btn" type="submit">{{ isLogin ? 'Submit' : 'Register' }}</button>


    </form>
  </div>
</template>

<script>

export default {
  name: 'LoginRegister',
  data() {
    return {
      isLogin: true,
      form: {
        uname: '',
        psw: '',
        confirmPsw: ''
      }
    }
  },
  computed: {

  },
  methods: {
    async handleSubmit() {

      const { uname, psw, confirmPsw } = this.form
      if (!this.isLogin && psw !== confirmPsw) return alert('两次密码不一致')

      const url = this.isLogin ? "/api/login" : "/api/register"
      const payload = { uname, psw }

      try {
        const res = await this.$store.dispatch('post', { url, payload })
        if (res.ok && this.isLogin) {
          this.$router.push('/home/blogger_home')
          sessionStorage.setItem('token', res.token)
        }
      } catch (err) {
        alert('请求失败')
        console.error(err)
      }
    }
  },

}
</script>

<style scoped>
html,
body,
.container {
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100vh;
  /* 占满视口高度 */
}

.form {
  font-size: 18px;
  width: 270px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: white;
  padding: 2.5em;
  border-radius: 25px;
  transition: .4s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.4) 1px 2px 2px;
  align-items: center;

}

.form:hover {
  transform: translateX(-0.5em) translateY(-0.5em);
  border: 1px solid #171717;
  box-shadow: 10px 10px 0px #666666;
}

.heading {
  color: black;
  padding-bottom: 1em;
  text-align: center;
  font-weight: bold;
}

.input {
  border-radius: 5px;
  width: 75%;
  border: 1px solid whitesmoke;
  background-color: whitesmoke;
  outline: none;
  padding: 0.7em;
  transition: .4s ease-in-out;
}

.input:hover {
  box-shadow: 6px 6px 0px #969696,
    -3px -3px 10px #ffffff;
}

.input:focus {
  background: #ffffff;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.3);
}

.login-or-register {
  color: rgb(87, 87, 87);
  margin: 28px;
  font-size: 15px;
  cursor: pointer;
}


.form .btn {
  /* margin-top:em; */
  align-self: center;
  padding: 0.7em;
  padding-left: 1em;
  padding-right: 1em;
  border-radius: 10px;
  border: none;
  color: black;
  transition: .4s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.4) 1px 1px 1px;
}

.form .btn:hover {
  box-shadow: 6px 6px 0px #969696,
    -3px -3px 10px #ffffff;
  transform: translateX(-0.5em) translateY(-0.5em);
}

.form .btn:active {
  transition: .2s;
  transform: translateX(0em) translateY(0em);
  box-shadow: none;
}
</style>
