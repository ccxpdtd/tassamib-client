<template>
  <div class="message-board-wrapper">
    <!-- 输入区域 -->
    <div class="form-card">

      <textarea
        v-model="form.message"
        class="textarea"
        placeholder="写点什么吧..."
      ></textarea>

      <button class="submit-btn" @click="submitMessage">留言</button>

    </div>

    <!-- 留言列表 -->
    <transition-group name="slide-down" tag="div" class="message-list">
      <div
        v-for="(message) in messages"
        :key="message.id"
        class="message-card"
      >
        <div class="avatar" >
          {{ message.uname ? message.uname.charAt(0).toUpperCase() : '👤' }}
        </div>

        <div class="message-content">
          <div class="meta">
            <span class="username">{{ message.username || "匿名用户" }}</span>
            <span class="dot">·</span>
            <span class="time">{{ message.created_at }}</span>

            <!-- 右上角删除按钮 -->
            <button class="delete-btn"
              v-show='role==="admin"||uname===message.username'
              @click="handleDelMsg(message.id)"
              
            >
              ✕
            </button>
          </div>
          <div class="text">{{ message.content }}</div>
        </div>
      </div>
    </transition-group>

  </div>
</template>

<script scoped>
import {mapState} from 'vuex'
export default {
  name: "CommentDemo",
  data() {
    return {
      form: {
        username: "",
        message: "",
      },
    };
  },
  computed:{
    ...mapState({
      uname: state => state.user.username,
      role: state => state.user.role
    }),
     ...mapState(['messages']) 
  },
  mounted() {
    this.$bus.$emit('showRamOrMsgOrAtc','msg')
  },
  methods: {
    handleDelMsg(id){
      this.$bus.$emit('deleteRamOrMsgOrAtc','msg',id)
    },

    async submitMessage(){

      
      if(!this.form.message)  return alert('请输入内容')

      const payload={
        uname:this.uname,
        msg:this.form.message
      }

      this.$bus.$emit('publishRamOrMsg','msg',payload)
      
      this.form.message=''
    }

  },
};
</script>

<style scoped>
.message-board-wrapper {
  width: 85%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 输入卡片 */
.form-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
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

/* 留言列表样式 */
.message-list {
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
  margin:13px 0 ;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 20px;
  transition: transform 0.2s;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05), 0 12px 24px rgba(0, 0, 0, 0.05);
}
.message-card:hover {
  transform: scale(1.03);
}

.avatar {
  width: 50px;
  height: 50px;
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
  margin-top:5px;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.username {
  font-size: 15px;
}
.dot {
  margin: 0 6px;
  color: gray;
}
.time {
  font-size: 12px;
  color: gray;
}
/* 删除按钮样式 */
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
  font-size: 15px;
  padding: 20px 45px 25px 0px;
  color: #444;
}
</style>
