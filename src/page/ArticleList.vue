<template>
  <div class="article-list" v-if="article">
    <div class="article-card">
      <div class="content">
        <h2 class="title">{{ article.title }}</h2>

        <!-- Markdown 内容，转换成 HTML 显示 -->
        <div class="description" v-html="renderMarkdown(article.content)"></div>

        <div class="meta">
          <span class="date">{{ article.date }}</span>
        </div>
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
  name: "ArticleList",
  data() {
    return {
      article: null,
    }
  },
  computed: {
    ...mapState(['articles'])
  },
  watch: {
    articles: {
      immediate: true,
      handler(val) {
        const id = this.$route.query.id
        if (!id || !val.length) return
        const found = val.find(a => String(a.id) === String(id))
        if (found) {
          this.article = found
        } else {
          // 如果没找到，可以跳转或请求服务器重新获取
          this.$router.push('/home')
        }
      }
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
.article-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 800px;
  margin: 50px auto;
  padding: 0 20px;
}

.article-card {
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
