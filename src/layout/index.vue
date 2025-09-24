<template>
  <!-- 页面 -->
  <div class="layout-container">
    <!-- 背景 -->
    <backgroundParticles :quantity="25" />
    <!-- 顶部导航栏 -->
    <div class="layout-tabbar">
      <Tabbar />
    </div>
    <!-- 内容展示区 -->
    <div class="layout-body">
      <myMain></myMain>
    </div>
  </div>
</template>

<script>
import 'animate.css'
import { jwtDecode } from 'jwt-decode'
import Tabbar from './tabbar/index.vue'
import myMain from './main/index.vue'
import backgroundParticles from '../components/background/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'myLayout',
  components: {
    Tabbar,
    myMain,
    backgroundParticles,
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

  mounted() {
    this.$store.dispatch('get', '/api/get_ramblings')
    this.$store.dispatch('get', '/api/get_messages')
    this.$store.dispatch('get', '/api/get_articles')
  },

}
</script>

<style scoped>
html {
  overflow: hidden;
}

.layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.layout-tabbar {
  width: 100%;
  height: 60px;
  position: fixed;
  /* 固定在页面 */
  left: 0;
  top: 0;
  z-index: 1000;
}

.layout-body {
  height: 100vh;
  width: 100%;
  padding-top: 100px;
  /* margin: auto; */

}
</style>
