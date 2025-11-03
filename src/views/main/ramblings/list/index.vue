<template>
  <div>
    <!-- 说说卡片列表 -->
    <div class="rambling-card" v-for="ram in ramblings" :key="ram.id">
      <!-- 右上角删除按钮 -->
      <button class="delete-btn" @click="handleDelRam(ram.id)" v-show="isAdmin()">✕</button>

      <!-- 左右结构 -->
      <div class="rambling-left">
        <img class="avatar" :src="ram.user_avatar" alt="头像" loading="lazy" />
      </div>

      <div class="rambling-right">
        <div class="header-info">
          <span class="username">{{ ram.user_name }}</span>
          <span class="date">{{ format(ram.created_at) }}</span>
        </div>

        <div class="rambling-content">{{ ram.content }}</div>

        <!-- 图片区 -->
        <div v-if="ram.photos" class="rambling-images">
          <div class="image-item" v-for="(photo, index) in ram.photos" :key="index"
            @click="openPreview(ram.photos, index)">
            <img :src="photo.img" class="image-preview" />
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览层 -->
    <div v-if="preview.visible" class="image-preview-overlay" @click.self="closePreview">
      <button class="close-btn" @click="closePreview">✕</button>

      <img class="preview-img" :src="preview.photos[preview.index].img" alt="预览" />

      <!-- 多图切换按钮 -->
      <button v-if="preview.photos.length > 1" class="nav-btn prev" @click.stop="prevImg">‹</button>
      <button v-if="preview.photos.length > 1" class="nav-btn next" @click.stop="nextImg">›</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Notification } from 'element-ui'
import parseToken from '@/util/parseToken'
import { formatTime } from '../../../../util/format'

export default {
  name: 'MomentsCard',

  data() {
    return {
      preview: {
        visible: false,
        photos: [],
        index: 0
      }
    }
  },

  computed: {
    ...mapState('rambling', ['ramblings'])
  },

  mounted() {
    this.getRamblings()
    window.addEventListener('keydown', this.handleKeydown)
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown)
  },

  methods: {
    ...mapActions('rambling', ['rambling_post', 'rambling_get']),

    async getRamblings() {
      const res = await this.rambling_get('/api/get_ramblings')
      if (res.code !== 200) Notification({ type: 'error', message: res.msg })
    },

    isAdmin() {
      const user = parseToken(localStorage.getItem('token'))
      return user?.role === 'admin'
    },

    async handleDelRam(id) {
      const res = await this.rambling_post({
        url: '/api/delete_rambling',
        payload: { id }
      })
      Notification({
        type: res.code === 200 ? 'success' : 'error',
        message: res.msg
      })
      this.rambling_get('/api/get_ramblings')
    },

    format(date) {
      return formatTime(date)
    },

    // 打开预览
    openPreview(photos, index) {
      this.preview.photos = photos
      this.preview.index = index
      this.preview.visible = true
      document.body.style.overflow = 'hidden'
    },

    // 关闭预览
    closePreview() {
      this.preview.visible = false
      document.body.style.overflow = ''
    },

    // 切换上一张
    prevImg() {
      this.preview.index =
        (this.preview.index - 1 + this.preview.photos.length) %
        this.preview.photos.length
    },

    // 切换下一张
    nextImg() {
      this.preview.index = (this.preview.index + 1) % this.preview.photos.length
    },

    // 键盘切换
    handleKeydown(e) {
      if (!this.preview.visible) return
      if (e.key === 'Escape') this.closePreview()
      if (e.key === 'ArrowLeft') this.prevImg()
      if (e.key === 'ArrowRight') this.nextImg()
    }
  }
}
</script>

<style scoped>
/* ===============================
   主体卡片样式
   =============================== */
.rambling-card {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 16px;
}

/* 左侧头像列 */
.rambling-left {
  flex: 0 0 60px;
  display: flex;
  justify-content: center;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

/* 右侧内容列 */
.rambling-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 删除按钮 */
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
  z-index: 10;
}

.delete-btn:hover {
  color: #f00;
}

/* 用户信息 */
.header-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.username {
  font-weight: bold;
  font-size: 16px;
}

.date {
  font-size: 13px;
  color: #999;
}

/* 内容区 */
.rambling-content {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

/* 图片展示区 */
.rambling-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.image-item {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  cursor: zoom-in;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-preview:hover {
  transform: scale(1.02);
}

/* 图片预览层 */
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preview-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  object-fit: contain;
  animation: fadeIn 0.3s ease;
}

.close-btn {
  position: fixed;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  z-index: 10000;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #f66;
}

.nav-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  color: #fff;
  background: transparent;
  border: none;
  cursor: pointer;
  user-select: none;
  z-index: 10000;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.nav-btn:hover {
  opacity: 1;
}

.nav-btn.prev {
  left: 40px;
}

.nav-btn.next {
  right: 40px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 平板及小屏 */
@media (max-width: 768px) {
  .rambling-card {
    flex-direction: column;
  }

  .rambling-left {
    justify-content: flex-start;
  }

  .rambling-images .image-item {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .image-item {
    width: 120px;
    height: 120px;
  }
}
</style>
