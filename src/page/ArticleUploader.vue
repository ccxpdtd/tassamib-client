<template>
  <div class="uploader-container">
    <div class="card">
      <h2 class="title">发布 Markdown 文章</h2>

      <div class="form-group">
        <label for="title">标题</label>
        <input type="text" v-model="form.title" id="title" placeholder="请输入文章标题" />
      </div>

      <div class="form-group">
        <label for="description">简介</label>
        <textarea v-model="form.description" id="description" placeholder="简要描述文章内容" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label for="author">作者</label>
        <input type="text" v-model="form.author" id="author" placeholder="请输入作者名" />
      </div>

      <div class="form-group">
        <label class="upload-label" for="markdownInput">
          <i class="fas fa-upload"></i> 上传 Markdown 文件
        </label>
        <input
          id="markdownInput"
          type="file"
          accept=".md"
          @change="handleFileUpload"
          class="file-input"
        />
        <div v-if="fileName" class="file-name">已选择文件：{{ fileName }}</div>
      </div>

      <button class="submit-btn" @click="submitArticle">发布</button>

      <div v-if="username" class="upload-status">{{ username }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import axios from 'axios'

export default {
  name: 'ArticleUploader',
  data() {
    return {
      fileName: '',
      Content: '',//内容
      username: '',//上传者
      form: {
        title: '',//标题
        description: '',//简介
        author: ''//作者
      }
    }
  },
  computed: {
    ...mapState({
      uname: state => state.user.username
    })
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file && file.name.endsWith('.md')) {
        this.fileName = file.name
        const reader = new FileReader()
        reader.onload = (e) => {
          this.Content = e.target.result
          if (!this.form.title) {
            this.form.title = file.name.replace('.md', '')
          }
        }
        reader.readAsText(file)
      } else {
        alert('请上传 .md 文件')
      }
    },

    async submitArticle() {
      if (!this.Content || !this.form.title || !this.form.description || !this.form.author) {
        this.username = '请填写完整信息并上传 Markdown 文件'
        return
      }
      const url='/api/uploadArticle'
      const payload = {
        uname: this.uname,
        title: this.form.title,
        description: this.form.description,
        author: this.form.author,
        content: this.Content
      }

      this.$store.dispatch('post',{url,payload})

      this.form.title= ''//标题
      this.form.description= ''//简介
      this.form.author= ''//作者this.
      this.fileName=''
      
      this.$router.push('/home/articles')
    }
  }
}
</script>

<style scoped>
.uploader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 12px;
}

.card {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 40px 30px;
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  width: 90%;
  max-width: 400px;
  text-align: left;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

input[type="text"],
textarea {
  width: 90%;
  max-width: 400px;
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4c627c;
}

.upload-label {
  display: inline-block;
  background-color: #4c627c;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
}

.upload-label:hover {
  background-color: #3a4e63;
}

.file-input {
  display: none;
}

.file-name {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.submit-btn {
  width: 90%;
  max-width: 400px;
  background-color: #2d8cf0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #1a73e8;
}

.upload-status {
  margin-top: 18px;
  font-size: 15px;
  font-weight: 500;
  color: #2b6cb0;
  text-align: center;
}
</style>
