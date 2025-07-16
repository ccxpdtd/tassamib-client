<template>
  <div class="card-container">
    <div
      class="card-body"
      ref="card"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @mouseenter="hoverScale = true"
      :style="transformStyleObj"
    >
      <div
        class="title"
        :style="hoverScale ? getTranslateZAndScale(40, 1.1) : getTranslateZ(40)"
      >
        Make things float in air
      </div>
      <div
        class="desc"
        :style="hoverScale ? getTranslateZAndScale(50, 1.1) : getTranslateZ(50)"
      >
        Hover over this card to unleash the power of CSS perspective
      </div>
      <img
        class="image"
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560"
        :style="hoverScale ? getTranslateZAndScale(80, 1.08) : getTranslateZ(80)"
      />
      <div class="footer">
        <a
          class="link"
          :style="hoverScale ? getTranslateZAndScale(30, 1.15) : getTranslateZ(30)"
        >
          Try now →
        </a>
        <button
          class="btn"
          :style="hoverScale ? getTranslateZAndScale(30, 1.1) : getTranslateZ(30)"
        >
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rotateX: 0,
      rotateY: 0,
      hoverScale: false,
    };
  },
  computed: {
    transformStyleObj() {
      return {
        transform: `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`,
        transition: 'transform 0.4s ease',
        transformStyle: 'preserve-3d',
      };
    },
  },
  methods: {
    handleMouseMove(e) {
      const card = this.$refs.card;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const percentX = deltaX / (rect.width / 2);
      const percentY = deltaY / (rect.height / 2);

      const maxRotate = 17;
      this.rotateY = percentX * maxRotate;
      this.rotateX = -percentY * maxRotate;
    },
    handleMouseLeave() {
      this.rotateX = 0;
      this.rotateY = 0;
      this.hoverScale = false;
    },
    getTranslateZ(z) {
      const scale = 1 + z / 500;
      return {
        transform: `translateZ(${z}px) scale(${scale})`,
        transition: 'transform 0.3s ease',
        transformStyle: 'preserve-3d',
      };
    },
    getTranslateZAndScale(z, scaleFactor) {
      const baseScale = 1 + z / 500;
      return {
        transform: `translateZ(${z}px) scale(${baseScale * scaleFactor})`,
        transition: 'transform 0.3s ease',
        transformStyle: 'preserve-3d',
      };
    },
  },
};
</script>

<style scoped>
.card-container {
  perspective: 1000px;
  display: flex;
  justify-content: center;
}

.card-body {
  width: 280px;
  height: 360px;
  padding: 25px;
  border-radius: 20px;
  background-color: rgba(250, 250, 250, 0.5);
  transform-style: preserve-3d;
  will-change: transform;
  border:1px solid rgb(233, 233, 233);

}

.title {
  font-size: 20px;
  font-weight: bold;
  transform-style: preserve-3d;
  margin:12px;
  text-align: center; /* ✅ 水平居中 */

}

.desc {
  font-size: 12px;
  color: #444;
  transform-style: preserve-3d;
  text-align: center; /* ✅ 水平居中 */
}

.image {
  width: 75%;
  height: auto;
  object-fit: cover;
  border-radius: 14px;
  margin: 45px auto 60px;
  display: block;
  transform-style: preserve-3d;

}

.footer {
  display: flex;
  justify-content: space-between;
}

.link {
  font-size: 13px;
  color: #111;
  text-decoration: none;
  transform-style: preserve-3d;
}

.btn {
  font-size: 13px;
  padding: 8px 16px;
  background: black;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transform-style: preserve-3d;
}
</style>
