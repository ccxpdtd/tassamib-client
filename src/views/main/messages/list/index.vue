<template>
  <transition-group name="slide-down" tag="div" class="message-list-container">
    <div v-for="(message) in messages" :key="message.id" class="message-card">
      <div class="avatar">
        {{ message.uname ? message.uname.charAt(0).toUpperCase() : '👤' }}
      </div>

      <div class="message-content">
        <div class="meta">
          <span class="username">{{ message.username || "匿名用户" }}</span>
          <span class="dot">·</span>
          <span class="time">{{ message.created_at }}</span>

          <!-- 删除按钮 -->
          <button class="delete-btn" v-show='role === "admin" || uname === message.username'
            @click="$emit('del-msg', message.id)">
            ✕
          </button>
        </div>
        <div class="text">{{ message.content }}</div>

        <!-- 回复框架，嵌入在每条留言内 -->
        <div class="reply-section">
          <div class="reply-item" v-for="reply in message.replies" :key="reply.id">
            <div class="reply-inner">
              <span class="reply-username">{{ reply.username || '匿名用户' }}</span>
              <span class="reply-dot">·</span>
              <span class="reply-time">{{ reply.created_at }}</span>
              <div class="reply-text">{{ reply.content }}</div>
              <button class="delete-btn comment" v-show='role === "admin" || uname === reply.username'
                @click="$emit('del-reply', reply.id, reply.message_id)">
                ✕
              </button>
            </div>
          </div>

          <div class="reply-input-wrapper">
            <input type="text" class="reply-input" v-model="commentMap[message.id]" placeholder="写下你的回复..." />
            <button class="reply-submit-btn" @click="handleComment(message.id)">发送</button>
          </div>
        </div>

      </div>
    </div>
  </transition-group>
</template>

<script scoped>
import { mapState } from 'vuex';
export default {
  name: "MessageList",
  data() {
    return {
      commentMap: {}
    }
  },
  computed: {
    ...mapState({
      uname: state => state.user.username,
      role: state => state.user.role,
      messages: state => state.messages
    }),
  },
  methods: {
    handleComment(message_id) {
      const content = this.commentMap[message_id];
      if (!content) return;
      const payload = {
        message_id,
        username: this.uname,
        content
      };
      this.$store.dispatch('post', { url: '/api/publish_comment', payload })
      this.$store.dispatch('get', '/api/get_messages')
      this.$set(this.commentMap, message_id, '');
    }
  }
};
</script>

<style scoped>
.message-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.message-card {
  margin: 13px 0;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: white;
  padding: 20px 20px 50px;
  border-radius: 20px;
  transition: transform 0.2s;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05);
  position: relative;
}

.message-card:hover {
  transform: scale(1.03);
}

.avatar {
  width: 60px;
  height: 60px;
  font-size: 20px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.message-content {
  flex: 1;
}

.meta {
  margin-top: 5px;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.username {
  font-size: 17.5px;
  font-weight: 500;
  color: rgb(93, 93, 93);
}

.dot {
  margin: 0 6px;
  color: gray;
}

.time {
  font-size: 12px;
  color: gray;
}

.delete-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  background: transparent;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0;
  line-height: 1;
}

.delete-btn:hover {
  color: #f00;
}

.text {
  font-size: 16px;
  padding: 20px 45px 20px 0px;
  color: #444;
  white-space: pre-wrap;
}

.reply-section {
  padding: 0 72px 0 24px;
  border-left: 2px solid #eee;
}

.reply-item {
  margin-bottom: 8px;
  background-color: #f6f6f6;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  position: relative;
}

.reply-inner {
  position: relative;
}

.reply-username {
  font-weight: 600;
  color: #2c3e50;
}

.reply-dot {
  margin: 0 4px;
  color: #999;
}

.reply-time {
  color: #aaa;
  font-size: 12px;
}

.reply-text {
  margin-top: 2px;
  color: #333;
  word-wrap: break-word;
}

.delete-btn.comment {
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #aaa;
  cursor: pointer;
}

.delete-btn.comment:hover {
  color: #f00;
}

.reply-input-wrapper {
  display: flex;
  margin-top: 6px;
}

.reply-input {
  flex: 1;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.reply-submit-btn {
  margin-left: 8px;
  padding: 4px 12px;
  font-size: 14px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 新增：移动端适配 */
@media (max-width: 600px) {
  .message-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  .avatar {
    width: 48px;
    height: 48px;
    font-size: 18px;
    border-radius: 12px;
    margin-bottom: 10px;
  }

  .meta {
    flex-wrap: wrap;
    font-size: 13px;
  }

  .username {
    font-size: 16px;
  }

  .text {
    font-size: 15px;
    padding-right: 0;
  }

  .reply-section {
    padding: 0 0 0 12px;
  }

  .reply-input-wrapper {
    flex-direction: column;
    gap: 6px;
  }

  .reply-submit-btn {
    width: 100%;
    margin-left: 0;
  }

  .delete-btn {
    top: 10px;
    right: 10px;
  }
}
</style>
