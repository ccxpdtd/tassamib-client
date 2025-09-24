<template>
  <nav class="tabbar-container">
    <ul class="tabbar-list">
      <li class="tabbar-item" v-for="item in navItems" :key="item.id">
        <router-link class="tabbar-item-font" :to="item.path">{{ item.text }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'myTabbar',
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

.tabbar-container {
  width: 100%;
  height: 100%;
  background-color: rgba(149, 150, 151, 0.1);
  /* z-index: 1000; */
  /* font-family: 'Inter', sans-serif; */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  /*元素背后的内容（而不是元素本身）应用模糊效果。*/
  display: flex;
  justify-content: center;
  align-items: center;
  /* 水平居中导航列表 */
}

.tabbar-list {
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tabbar-item {
  margin: 0 50px;
}

.tabbar-item-font {
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
</style>
