<template>
  <!-- 用户信息头部 -->
  <div class="user-profile-caontainer card">
    <div class="background"></div>
    <div class="user-profile">
      <img class="avatar" src='https://i.imgs.ovh/2025/07/19/MSLCd.jpeg' alt="用户头像" loading="lazy" />
      <div class="user-info">
        <h2 class="username">奥利奥去利</h2>
        <p class="bio">这个人很懒，什么都没有留下</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfile",

}
</script>

<style scoped>
.user-profile-caontainer {
  height: 480px;
  position: relative;
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
}

.background {
  background-image: url('https://i.imgs.ovh/2025/07/19/MSFtO.jpeg');
  background-size: cover;
  background-position: center;
  height: 350px;
  width: 100%;
}

.user-profile {
  margin-left: 20px;
  margin-top: -20px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 2.5px solid white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  margin-left: 20px;
  color: #333;
}

.username {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.bio {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
</style>
