<template>
  <div class="message-pubulish-container">
    <textarea v-model="form.message" class="textarea" placeholder="写点什么吧..."></textarea>
    <button class="submit-btn" @click="submitMessage">留言</button>
  </div>
</template>

<script scoped>
export default {
  name: "PublishMessage",
  data() {
    return {
      form: {
        username: "",
        message: "",
      },
    };
  },
  methods: {
    submitMessage() {
      if (!this.form.message) return alert('请输入内容');
      const payload = {
        uname: this.$store.state.user.username,
        msg: this.form.message
      };
      this.$store.dispatch('post', { url: '/api/publish_message', payload })
      this.$store.dispatch('get', '/api/get_messages')
      this.form.message = '';
    }
  }
};
</script>

<style scoped>
.message-pubulish-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;

}

.textarea {
  width: 95%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 14px;
  height: 80px;
  resize: none;
  font-family: inherit;
  color: #333;
}

.submit-btn {
  align-self: flex-end;
  background: #1e86ff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #1473e6;
}
</style>
