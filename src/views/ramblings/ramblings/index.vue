<template>
  <div class="rambling-card">
    <!-- 右上角删除按钮 -->
    <button class="delete-btn" @click="handleDelRam(id)" v-show='role === "admin"'>
      ✕
    </button>

    <!-- 顶部：头像、用户名、时间 -->
    <div class="rambling-header">
      <img class="avatar" src="https://i.imgs.ovh/2025/07/19/MSLCd.jpeg" alt="头像" loading="lazy" />
      <div class="header-info">
        <span class="username">奥利奥去利</span>
        <span class="date">{{ date }}</span>
      </div>
    </div>

    <!-- 内容（不使用 v-html，只渲染普通文字） -->
    <div class="rambling-content">{{ content }}</div>

    <!-- 图片区域（如果有图） -->
    <div v-if="img_url" class="rambling-image">
      <img :src="img_url" alt="配图" />
    </div>

    <!-- 底部：点赞和评论 -->
    <!--     <div class="rambling-footer">
      <BtnComment class="action" ></BtnComment>
       <BtnLike class="action" @click="handleLike(id)" >
        <template v-slot>
          {{ like_count }}
        </template>
</BtnLike>
</div> -->

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MomentsCard',
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      role: state => state.user.role
    }),
  },
  components: {

  },
  props: {
    id: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    img_url: {
      type: String,
      default: ''
    },
    like_count: {
      type: Number,
      required: true
    },
  },
  methods: {
    handleDelRam(id) {
      this.$store.dispatch('post', { url: '/api/delete_rambling', payload: { id } })
      this.$store.dispatch('get', '/api/get_ramblings')
    },

  },
}
</script>

<style scoped>
.rambling-card {
  position: relative;
  /* 为删除按钮绝对定位做准备 */
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
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

/* 下面是你已有的样式 */
.rambling-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  font-size: 16px;
}

.date {
  font-size: 13px;
  color: #999;
}

.rambling-content {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-wrap;
  padding: 10px 60px;
}

.rambling-image {
  text-align: center;
  margin-bottom: 12px;
}

.rambling-image img {
  max-width: 100%;
  border-radius: 10px;
  border: 1px solid #eee;
}

.rambling-footer {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 8px;
  font-size: 14px;
  color: #666;
}

.action {
  cursor: pointer;
}
</style>
