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
      ],
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.fixed-nav {


  width: 100%; 
  height: 100%; 
  background-color: rgba(149, 150, 151, 0.1);
  padding: 20px 0;
  z-index: 1000;
  
  font-family: 'Inter', sans-serif;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  display: flex;               /* 启用 Flex 布局 */
  flex-direction: column;     /* 垂直排列子元素 */
  justify-content: center;    /* 垂直方向居中 nav-list */
  align-items: center;        /* 水平方向居中 nav-list */
}

.nav-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  margin: 40px 0;
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
