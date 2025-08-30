<template>
  <div class="message-board-wrapper">
    <PublishMessage />
    <MessageList @del-msg="handleDelMsg" @del-reply="handleDelReply"/>
  </div>
</template>

<script scoped>
import PublishMessage from '../components/PublishMessage.vue';
import MessageList from '../components/MessagesList.vue';

export default {
  name: "CommentDemo",
  components: {
    PublishMessage,
    MessageList,
  },
  methods: {
    handleDelMsg(id) {
      this.$bus.$emit('handlePost', '/api/delete_message', { id });
      this.$bus.$emit('handleGet', '/api/get_messages');
    },
    handleDelReply(id) {
      this.$bus.$emit('handlePost', '/api/delete_reply', { id });
      this.$bus.$emit('handleGet', '/api/get_messages');
    }
  },
  mounted() {
    this.$bus.$emit('handleGet', '/api/get_messages');
  }
};
</script>

<style scoped>
.message-board-wrapper {
  width: 60%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
