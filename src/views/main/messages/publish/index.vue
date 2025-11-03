<template>
  <div class="message-pubulish-container">
    <textarea v-model="form.message" class="textarea" placeholder="写点什么吧..."></textarea>
    <button class="submit-btn" @click="submitMessage">留言</button>
  </div>
</template>

<script scoped>
import parseToken from '@/util/parseToken';
import { Notification } from 'element-ui';
import { mapActions } from 'vuex'
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
  mounted() {
  },
  methods: {
    ...mapActions('message', ['message_post', 'message_get']),

    async submitMessage() {
      if (!this.form.message)
        return Notification({ type: 'warning', message: '请输入内容' });

      const user = parseToken(localStorage.getItem('token'))
      if (!user)
        return Notification({ type: 'warning', message: '请先登录' });
      const payload = {
        user_id: user.id,
        msg: this.form.message
      };

      const res = await this.message_post({ url: '/api/publish_message', payload })
      Notification({
        type: res.code === 200 ? 'success' : 'error',
        message: res.msg
      })
      this.form.message = '';
      this.message_get('/api/get_messages')
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
