<template>

    <!-- 用户信息头部 -->
    <div class="user-header card">
      <div class="background"></div>
      <div class="avatar-box">
        <img class="avatar" src='https://i.imgur.com/uZTb7P4.jpeg' alt="用户头像" />
        <div class="user-info">
          <h2 class="username">奥利奥去利</h2>
          <p class="bio">这个人很懒，什么都没有留下</p>
        </div>
      </div>
    </div>



</template>

<script>
import { marked } from 'marked'
import { mapState } from 'vuex'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export default {
  name: "UserProfile",
  computed: {
    ...mapState(['articles']),

    userArticles() {
      // 模拟过滤 userId=1 的文章
      return this.articles.filter(a => a.userId === 1)
    }
  },
  methods: {
    renderMarkdown(mdText) {
      marked.setOptions({
        highlight: function (code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value
          }
          return hljs.highlightAuto(code).value
        }
      })
      return marked(mdText)
    }
  }
}
</script>

<style scoped>


.user-header {
  position: relative;
  height: 480px;
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
}
.background {
  background-image: url('https://i.imgur.com/MzxuQhf.jpeg');
  background-size: cover;
  background-position: center;
  height: 350px;
  width: 100%;
}
.avatar-box {

  margin-left:20px;
  margin-top:-20px;
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
