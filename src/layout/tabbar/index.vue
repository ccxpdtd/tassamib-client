<template>
  <nav class="tabbar-container">
    <!-- 左侧博客名字 -->
    <span class="blog-name">tassamib</span>
    <!-- 中间路由导航 -->
    <ul class="routes-list">
      <li class="route-item" v-for="route in myTabbarRoutes" :key="route.path">
        <router-link class="route-font" :to="route.path">{{ route.meta.title }}</router-link>
      </li>
    </ul>
    <!-- 右侧用户信息、设置、登录/登出 -->
    <div class="user-info">
      <img :src="userInfo.avatar || 'https://pic.616pic.com/ys_img/00/06/27/5m1AgeRLf3.jpg'" alt="" class="user-avatar">
      <span class="user-name">{{ userInfo.name || '游客' }}</span>
      <i class="el-icon-setting settings" size="20" @click="goToSettings"></i>
      <el-button class="login-button" @click="loginOrLogout">{{ userInfo.name ? '退出登录' : '登录' }}</el-button>
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';
import { myRoutes } from '../../router/routes';
import parseToken from '../../util/parseToken';
import { Notification } from 'element-ui';

export default {
  name: 'myTabbar',
  data() {
    return {
      myTabbarRoutes: [],
      userInfo: {}
    };
  },
  mounted() {
    this.getRoutes()
    this.getUserInfo()
  },
  methods: {
    ...mapActions('user', ['user_get']),
    getRoutes() {
      const myLayout = myRoutes.find(r => r.name === 'myLayout')
      this.myTabbarRoutes = myLayout.children.filter(r => !r.meta.hidden)
    },
    async getUserInfo() {
      const { id } = parseToken(localStorage.getItem('token'))
      if (!id) return
      const url = '/api/get_myinfo'
      const payload = { id }
      const res = await this.user_get({ url, payload })//user_get用的不是封装好的request

      res.code === 200 ? this.userInfo = res.userInfo :
        Notification({ type: 'error', message: res.msg })
    },
    loginOrLogout() {
      const user = parseToken(localStorage.getItem('token'))
      if (user)
        localStorage.removeItem('token')
      this.$router.push('/login')

    },
    goToSettings() {
      this.$router.push({ name: 'mySettings' })
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.tabbar-container {
  width: 100%;
  height: 100%;

  background-color: rgba(149, 150, 151, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  /*元素背后的内容（而不是元素本身）应用模糊效果。*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 水平居中导航列表 */
  padding: 0 40px;
  box-sizing: border-box;

}

.blog-name {
  color: rgb(90, 90, 90);
  font-size: 17px;
  font-weight: 440;
}

.routes-list {
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  list-style: none;
}

.route-item {
  margin: 0 30px;
}

.route-font {
  color: rgb(90, 90, 90);
  text-decoration: none;
  font-size: 17px;
  transition: color 0.3s;
  font-weight: 440;
}

.tabbar-item-font:hover {
  color: #5b7696;
  cursor: pointer;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.user-name {
  color: rgb(90, 90, 90);
  font-size: 18px;
  /* margin: 0 15px; */
}

.settings {
  color: rgb(90, 90, 90);
  /* margin: 0 15px; */
  font-size: 25px;
}

.settings:hover {
  cursor: pointer;
}

.login-button {
  padding: 8px 12px;
}
</style>
