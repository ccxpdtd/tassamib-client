<template>
  <div class="meteor-background">
    <div
      v-for="n in quantity"
      :key="n"
      class="meteor"
      :style="generateStyle()"
    />
  </div>
</template>

<script>
export default {
  name: "ParticlesDemo",
  props: {
    quantity: {
      type: Number,
      default: 30,
    },
  },
  methods: {
    generateStyle() {
      const delay = Math.random() * 10;

      // 横向位置：偏移中心 50%，更平均
      const left = 25 + Math.random() * 130;

      // 计算距离中间的比例（中心在 300）
      const distToCenter = Math.abs(left - 300);
      const maxDist = 300; // 最大中心距离（左右都在 50~550 之间）
      const ratio = distToCenter / maxDist;

      // 动画时长，非线性：边远慢，中间快（2 ~ 6 秒）
      const duration = 3.5 + Math.pow(ratio, 3) * 10.5;

      // 起始高度在屏幕上方之外
      const top = -35; // 固定从上面来，避免随机导致太低

      const opacity = 0.3 + Math.random() * 0.5;

      return {
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity,
      };
    },
  },
};
</script>

<style scoped>
.meteor-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
}

.meteor {
  position: absolute;
  width: 2px;
  height: 80px;
  background: linear-gradient(180deg, transparent, #404143);
  animation: meteor-fall linear infinite;
  transform: rotate(30deg);
  border-radius: 1px;
  overflow: visible; /* 允许伪元素显示 */
}

.meteor::after {
  content: '';
  position: absolute;
  bottom: 0;       /* 流星头部在下端 */
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: #404143;
  border-radius: 50%;
  pointer-events: none;
  filter: drop-shadow(0 0 2px rgba(64,65,67,0.8));
}

@keyframes meteor-fall {
  0% {
    transform: translate(0, 0) rotate(30deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(-1000px, 150vh) rotate(30deg);
    opacity: 0;
  }
}
</style>
