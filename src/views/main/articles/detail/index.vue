<template>
  <div class="article-detail-container">
    <!-- 目录侧边栏 -->
    <aside class="toc">
      <ul>
        <li v-for="item in toc" :key="item.slug" :style="{ paddingLeft: (item.level - 1) * 16 + 'px' }">
          <a href="javascript:;" @click="scrollTo(item.slug)">{{ item.content }}</a>
        </li>
      </ul>
    </aside>

    <!-- 文章内容 -->
    <div class="article-view-box markdown-body" ref="articleBox" v-html="htmlContent"></div>
  </div>
</template>

<script>
// import axios from 'axios'
// import { mapState } from 'vuex'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 高亮样式，可换其他主题

export default {
  name: 'articleDetail',
  data() {
    return {
      content: "",
      htmlContent: "",
      toc: []
    }
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    async getArticle() {
      const id = this.$route.query.id
      try {
        const article = await this.$store.dispatch('get', `/api/get_article/${id}`)
        this.content = article.content
        this.generateHtmlAndToc()
      } catch (error) {
        console.log(error);
      }

    },
    generateHtmlAndToc() {
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return '<pre class="hljs"><code>' +
                hljs.highlight(str, { language: lang }).value +
                '</code></pre>';
            } catch (err) {
              console.log(err.mesage);

            }
          }
          return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        }
      })

      const tokens = md.parse(this.content, {})
      const toc = []

      // 生成 TOC 并给标题加 id
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if (token.type === 'heading_open') {
          const level = parseInt(token.tag.slice(1))
          const contentToken = tokens[i + 1]
          const content = contentToken.content
          const slug = content.replace(/\s+/g, '-')
          toc.push({ level, content, slug })
          token.attrs = token.attrs || []
          token.attrs.push(['id', slug])
        }
      }

      this.toc = toc
      this.htmlContent = md.renderer.render(tokens, md.options)
    },

    scrollTo(slug) {
      const articleEl = this.$refs.articleBox
      if (!articleEl) return
      const header = articleEl.querySelector(`#${slug}`)
      if (header) {
        const top = header.getBoundingClientRect().top + window.pageYOffset - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }
}
</script>

<style>
.article-detail-container {
  display: flex;
  width: 90%;
  height: 100%;
  margin: 20px auto;

}

/* 目录固定侧边栏 */
.toc {
  position: sticky;
  top: 80px;
  max-width: 380px;
  margin-right: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.toc ul {
  list-style: none;
  padding: 30px 30px;
  margin: 0;
}

.toc li {
  margin-bottom: 6px;
}

.toc a {
  color: #404041;
  text-decoration: none;
  cursor: pointer;
  font-size: 16px;
}

.toc a:hover {
  text-decoration: underline;
}

/* 内容区域 */
.article-view-box {
  width: 800px;

  opacity: 0.94;
  padding: 30px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Markdown 样式 */
.markdown-body {
  font-size: 18px;
}

.markdown-body h1 {
  font-size: 2em;
  margin: 1em 0;
}

.markdown-body h2 {
  font-size: 1.5em;
  margin: 0.75em 0;
}

.markdown-body h3 {
  font-size: 1.2em;
  margin: 0.75em 0;
}

.markdown-body p {
  margin: 0.5em 0;
  line-height: 1.6;
}

.markdown-body pre {
  background: #f5f5f5;
  padding: 10px;
  overflow-x: auto;
  border-radius: 4px;
}

.markdown-body code {
  /* background: #f5f5f5; */
  padding: 2px 4px;
  border-radius: 4px;
}

.markdown-body blockquote {
  border-left: 3px solid #ddd;
  padding-left: 10px;
  color: #666;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
}

.markdown-body table,
.markdown-body th,
.markdown-body td {
  border: 1px solid #ccc;
  padding: 6px;
}

/* highlight.js 高亮样式微调 */
.hljs {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
