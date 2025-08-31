<!-- 文章列表 -->
<template>
  <div class="article-page">
    <div class="article-list">
      <div class="article-card" v-for="(article, index) in articles" :key="index" @click="goToArticle(article.id)">

        <div class="content">
          <div class="title_delete_group">
            <h2 class="title">{{ article.title }}</h2>
            <button class="delete-btn" v-show='role === "admin"' @click="handleDelMsg(article.id, $event)">
              ✕
            </button>
          </div>
          <p class="description">{{ article.description }}</p>
          <div class="meta">
            <span class="author">{{ article.author }}</span>
            <span class="date">{{ article.date }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-publish">
      <PublishButton></PublishButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PublishButton from '../components/Ad_PublishButton.vue'
export default {
  name: "ArticleList",
  components: {
    PublishButton
  },
  data() {
    return {

    };
  },

  mounted() {
    this.$bus.$emit('handleGet', '/api/get_articles')
  },
  computed: {
    ...mapState({
      uname: state => state.user.username,
      role: state => state.user.role,
      articles: state => state.articles,
    }),
  },
  methods: {
    goToArticle(id) {
      // 你可以用 vue-router 进行跳转
      this.$router.push({ name: 'ArticleList', query: { id } });
    },

    handleDelMsg(id, event) {
      this.$bus.$emit('handlePost', '/api/delete_article', { id })
      this.$bus.$emit('handleGet', '/api/get_articles')
      event.stopPropagation();
    }
  },
};
</script>

<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 60%;
  margin: 50px auto;
  padding: 0 20px;
}

.article-card {
  height: auto;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.content {
  padding: 35px;
}

.title {
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.description {
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  margin: 0px;
  padding: 10px 0;
  white-space: pre-line;

  /* margin-bottom: 12px; */
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}

.title_delete_group {
  display: flex;
  flex-direction: row;
}

/* 删除按钮样式 */
.delete-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
  line-height: 1;
}

.delete-btn:hover {
  color: #f00;
}

.btn-publish {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  /* 确保按钮盖在其他内容上 */
}
</style>
