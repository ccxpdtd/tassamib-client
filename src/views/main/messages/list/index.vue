<template>
  <transition-group name="slide-down" tag="div" class="message-list-container">
    <div v-for="(message) in messages" :key="message.id" class="message-card">
      <div class="avatar">
        <img :src="message.user_avatar || 'https://pic.616pic.com/ys_img/00/06/27/5m1AgeRLf3.jpg'">

      </div>

      <div class="message-content">
        <div class="meta">
          <span class="username">{{ message.user_name || "匿名用户" }}</span>
          <span class="dot">·</span>
          <span class="time">{{ format(message.created_at) }}</span>

          <!-- 删除按钮 -->
          <button class="delete-btn" v-show='userInfo.role === "admin" || userInfo.id === message.user_id'
            @click="$emit('del-msg', message.id)">
            ✕
          </button>
        </div>
        <div class="text">{{ message.content }}</div>

        <!-- 回复框架，嵌入在每条留言内 -->
        <div class="comment-section">
          <div class="comment-item" v-for="comment in message.comments" :key="comment.id">
            <div class="comment-inner">
              <span class="comment-username">{{ comment.user_name || '匿名用户' }}</span>
              <span class="comment-dot">·</span>
              <span class="comment-time">{{ format(comment.created_at) }}</span>
              <div class="comment-text">{{ comment.content }}</div>
              <button class="delete-btn comment" v-show='userInfo.role === "admin" || userInfo.id === comment.user_id'
                @click="$emit('del-reply', comment.id, comment.message_id)">
                ✕
              </button>
            </div>
          </div>

          <div class="comment-input-wrapper">
            <input type="text" class="comment-input" v-model="commentMap[message.id]" placeholder="写下你的回复..." />
            <button class="comment-submit-btn" @click="handleComment(message.id)">发送</button>
          </div>
        </div>

      </div>
    </div>
  </transition-group>
</template>

<script scoped>
import { Notification } from 'element-ui';
import { mapState, mapActions } from 'vuex';
import parseToken from '../../../../util/parseToken';
import { formatTime } from '../../../../util/format';

export default {
  name: "MessageList",
  data() {
    return {
      commentMap: {},
      userInfo: {}
    }
  },
  computed: {
    ...mapState('message', ['messages']),
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {

    ...mapActions('message', ['message_post', 'message_get']),

    getUserInfo() {
      const user = parseToken(localStorage.getItem('token'))
      if (!user) return
      this.userInfo = {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    },

    handleComment(message_id) {
      const content = this.commentMap[message_id];
      if (!content) return Notification({ type: 'warning', message: '请输入内容' });
      if (!this.userInfo.id) return Notification({ type: 'warning', message: '请先登录' });
      const payload = {
        message_id,
        user_id: this.userInfo.id,
        content
      };

      this.message_post({ url: '/api/publish_comment', payload })
      this.message_get('/api/get_messages')
      this.$set(this.commentMap, message_id, '');
    },
    format(date) {
      return formatTime(date)
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



.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 20px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;

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

.comment-section {
  padding: 0 72px 0 24px;
  border-left: 2px solid #eee;
}

.comment-item {
  margin-bottom: 8px;
  background-color: #f6f6f6;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  position: relative;
}

.comment-inner {
  position: relative;
}

.comment-username {
  font-weight: 600;
  color: #2c3e50;
}

.comment-dot {
  margin: 0 4px;
  color: #999;
}

.comment-time {
  color: #aaa;
  font-size: 12px;
}

.comment-text {
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

.comment-input-wrapper {
  display: flex;
  margin-top: 6px;
}

.comment-input {
  flex: 1;
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.comment-submit-btn {
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

  .comment-section {
    padding: 0 0 0 12px;
  }

  .comment-input-wrapper {
    flex-direction: column;
    gap: 6px;
  }

  .comment-submit-btn {
    width: 100%;
    margin-left: 0;
  }

  .delete-btn {
    top: 10px;
    right: 10px;
  }
}
</style>
