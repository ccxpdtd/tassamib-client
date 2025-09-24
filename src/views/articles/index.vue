<!-- 文章列表 -->
<template>
  <div class="article-container">
    <div class="article-list">
      <div class="article-card" v-for="(article, index) in articles" :key="index" @click="goToArticle(article.id)">
        <!-- 文章介绍 -->
        <div class="article-info">
          <h2 class="title">{{ article.title }}</h2>
          <p class="description">{{ article.description }}</p>
          <div class="meta">
            <span class="author">{{ article.author }}</span>
            <span class="date">{{ article.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: "ArticleList",
  data() {
    return {
    };
  },
  mounted() {
    this.$store.dispatch('get', '/api/get_articles')
  },
  computed: {
    ...mapState({
      uname: state => state.user.username,
      role: state => state.user.role,
      articles: state => state.articles,
    }),
  },
  methods: {
    //点击文章跳转
    goToArticle(id) {
      this.$router.push({ name: 'myArticleDetail', query: { id } });
    },
  },
};
</script>

<style scoped>
.article-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* margin-top: 65px; */

}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 60%;
  margin: 0 auto;
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

.article-info {
  padding: 35px;
}

.title {
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 15px 0;
}

.description {
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 15px 0;
  white-space: pre-line;

}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
}
</style>
