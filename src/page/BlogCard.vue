<template>
  <div class="article-page">
    <div class="article-list">
      <div
        class="article-card"
        v-for="(article, index) in articles"
        :key="index"
        @click="goToArticle(article.id)"
      >

        <img class="cover" src="https://picsum.photos/seed/vue/600/300" alt="封面" loading="lazy"/> 

        <div class="content">
          <h2 class="title">{{ article.title }}</h2>
          <p class="description">{{ article.description }}</p>
          <div class="meta">
            <span class="author">{{ article.author }}</span>
            <span class="date">{{ article.date }}</span>
          </div>
        </div>
      </div>
    </div>
    <PublishButton></PublishButton>
  </div>
</template>

<script>
import PublishButton from '../components/Ad_PublishButton.vue'
export default {
  name: "ArticleList",
  components:{
    PublishButton
  },
  data() {
    return {
      articles: [],
    };
  },
  mounted(){
    this.fetchArticles()
  },
  methods: {
    goToArticle(id) {
      // 你可以用 vue-router 进行跳转
      this.$router.push({ name:'ArticleList', query: { id } });
    },

    async fetchArticles() {

      const url='/api/articles'
      try{
        const isOK=await  this.$store.dispatch('get', url)
        
        if(isOK){
          this.articles = this.$store.state.articles
        }
      }catch (err) {
        alert('请求失败')
        console.error(err)
      }
    },

  },
};
</script>

<style scoped>
.article-page{
  display:flex;
  flex-direction: row;
}
.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width:80%;
  margin: 50px auto;
  padding: 0 20px;
}

.article-card {
  height: 370px;
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
  padding: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
}
</style>
