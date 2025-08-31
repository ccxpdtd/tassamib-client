<template>
  <nav class="fixed-nav">
    <ul class="nav-list">
      <li class="nav-item" v-for="item in navItems" :key="item.id">
        <router-link class="nav-font" :to="item.path">{{ item.text }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavbarDemo',
  data() {
    return {
      navItems: [
        { id: 1, text: 'tassamib', path: '/home/blogger_home' },
        { id: 2, text: '博客', path: '/home/articles' },
        { id: 3, text: '碎碎念', path: '/home/ramblings' },
        { id: 4, text: '留言板', path: '/home/message' },
        { id: 5, text: '登录', path: '/login' },
      ],
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.fixed-nav {
  width: 100%;
  height: 60px;
  background-color: rgba(149, 150, 151, 0.1);
  z-index: 1000;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  /* 垂直居中导航项 */
  justify-content: center;
  /* 水平居中导航列表 */
}

.nav-list {
  display: flex;
  flex-direction: row;
  /* 横向排列 */
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  margin: 0 50px;
  /* 左右间距 */
}

.nav-font {
  color: rgb(88, 88, 88);
  text-decoration: none;
  font-size: 17px;
  transition: color 0.3s;
  font-weight: 430;
}

.nav-font:hover {
  color: #4c627c;
  cursor: pointer;
}
</style>
