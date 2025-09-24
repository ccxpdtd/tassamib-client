<!-- 留言模块 -->
<template>
  <div class="message-container">
    <!-- 发布留言 -->
    <PublishMessage />
    <!-- 留言列表 -->
    <MessageList @del-msg="handleDelMsg" @del-reply="handleDelReply" />
  </div>
</template>

<script scoped>
import PublishMessage from './publish/index.vue';
import MessageList from './list/index.vue';

export default {
  name: "CommentDemo",
  components: {
    PublishMessage,
    MessageList,
  },
  methods: {
    handleDelMsg(id) {
      const payload = { id }
      this.$store.dispatch('post', { url: '/api/delete_message', payload })
      this.$store.dispatch('get', '/api/get_messages')
    },
    handleDelReply(id, mid) {
      const payload = { id, mid }
      this.$store.dispatch('post', { url: '/api/delete_reply', payload })
      this.$store.dispatch('get', '/api/get_messages')
    }
  },
  mounted() {
    this.$store.dispatch('get', '/api/get_messages')
  }
};
</script>

<style scoped>
.message-container {
  /* width: 60%; */
  max-width: 580px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
