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

import { Notification } from 'element-ui';

import PublishMessage from './publish/index.vue';
import MessageList from './list/index.vue';

import { mapActions } from 'vuex';

export default {
  name: "CommentDemo",
  components: {
    PublishMessage,
    MessageList,
  },
  methods: {
    ...mapActions('message', ['message_post', 'message_get']),
    async handleDelMsg(id) {
      const payload = { id }
      const res = await this.message_post({ url: '/api/delete_message', payload })
      Notification({
        type: res.code === 200 ? 'success' : 'error',
        message: res.msg
      })
      this.message_get('/api/get_messages')
    },
    async handleDelReply(id, mid) {
      const payload = { id, mid }
      const res = await this.message_post({ url: '/api/delete_reply', payload })
      Notification({
        type: res.code === 200 ? 'success' : 'error',
        message: res.msg
      })
      this.message_get('/api/get_messages')
    }
  },
  mounted() {
    this.message_get('/api/get_messages')
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
