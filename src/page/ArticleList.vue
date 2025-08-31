<template>
  <div class="acticle-view-box">
    <mavon-editor v-model="content" :toolbarsFlag="false" :subfield="false" :editable="false" defaultOpen="preview" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return { content: "" };
  },
  created() {
    const id = this.$route.query.id
    axios.get(`/api/get_article/${id}`).then(res => {
      console.log('res', res);

      this.content = res.data.content; // 数据库里存的纯 Markdown
    });
  }
};
</script>

<style>
.acticle-view-box {
  width: 80%;
  margin: 20px auto;
  opacity: 0.94;

}
</style>
