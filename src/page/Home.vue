<template>
  <!-- 页面 -->
  <div class="page">
    <ParticlesDemo :quantity="25" />
    <!-- 导航栏 -->
    <div class="navbar-wrapper">
      <Navbar />
    </div>
    <!-- 展示区 -->
    <div class="page-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import 'animate.css'
import { jwtDecode } from 'jwt-decode'
import Navbar from '../components/Navbar.vue'
import ParticlesDemo from '../components/ParticlesDemo.vue'
import { mapState } from 'vuex'


export default {
  name: 'HomeDemo',
  components: {
    Navbar,
    ParticlesDemo,
  },
  computed: {
    ...mapState({
      uname: state => state.user.username
    }),
  },
  created() {
    const token = sessionStorage.getItem('token')
    if (token) {
      try {
        const payload = jwtDecode(token)
        this.$store.dispatch('setUser', payload)
      } catch (err) {
        console.error('Token 解析失败:', err)
        sessionStorage.removeItem('token')
      }
    }
  },

  methods: {
    async handleGet(url) {
      try {
        await this.$store.dispatch('get', url)
      } catch (err) {
        alert('请求失败')
        console.error(err)
      }
    },

    async handlePost(url, payload) {
      if (!sessionStorage.getItem('token')) {
        alert('请先登录')
        return
      }

      try {
        await this.$store.dispatch('post', { url, payload })
      } catch (err) {
        alert('请求失败')
        console.error(err)
      }
    }

  },

  mounted() {
    this.$bus.$on('handleGet', this.handleGet)
    this.$bus.$on('handlePost', this.handlePost)

    this.$bus.$emit('handleGet', '/api/get_ramblings')
    this.$bus.$emit('handleGet', '/api/get_messages')
    this.$bus.$emit('handleGet', '/api/get_articles')

    console.log('Home/mouted：', this.$store.state);

  },
  beforeDestroy() {
    this.$bus.$off('handleGet', this.handleGet)
    this.$bus.$off('handlePost', this.handlePost)

  },
}
</script>

<style scoped>
html {
  overflow: hidden;

}

.page {
  display: flex;
  height: 100vh;
  /* 全屏高度 */
}

.navbar-wrapper {
  width: 100%;
  /* 你可以改成你想要的比例，例如 20%、15% */
  position: fixed;
  /* 固定在页面 */
  left: 0;
  top: 0;
  z-index: 1000;

}

.page-body {

  padding-top: 60px;
  margin: auto;
  height: 100vh;
  width: 100%;
}
</style>
