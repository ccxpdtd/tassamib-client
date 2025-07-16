<template>
  <div class="wrapper">
    <div class="inner" :style="`--quantity: ${skills.length};`">
      <div
        v-for="(skill, index) in skills"
        :key="index"
        class="card"
        :style="`--index: ${index}; --color-card: ${skill.color};`"
      >
        <div class="img">
          <div class="first-content">{{ skill.name }}</div>
          <div class="second-content">
            <svg width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="#eee"
                stroke-width="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                :stroke="skill.colorRGB"
                stroke-width="8"
                fill="none"
                stroke-linecap="round"
                :stroke-dasharray="188.4"
                :stroke-dashoffset="188.4 - (188.4 * skill.level / 100)"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div class="percent-text">{{ skill.level }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkillCircle",
  data() {
    return {
      skills: [
        { name: "Vue", level: 85, color: "204, 255, 229", colorRGB: "#8ef9fc" },
        { name: "JavaScript", level: 90, color: "255, 255, 153", colorRGB: "#8efccc" },
        { name: "Node.js", level: 75, color: "255, 204, 153", colorRGB: "#8efc9d" },
        { name: "CSS", level: 88, color: "178, 102, 255", colorRGB: "#d7fc8e" },
        { name: "HTML", level: 92, color: "153, 204, 255", colorRGB: "#fcfc8e" },
        { name: "MySQL", level: 70, color: "224, 224, 224", colorRGB: "#fcd08e" },
        { name: "Git", level: 60, color: "252, 142, 142", colorRGB: "#fc8e8e" },
        
        
        
      ],
    };
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 450px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.inner {
  --w: 140px;
  --h: 180px;
  --translateZ: calc((var(--w) + var(--h)) + 30px);
  --rotateX: -15deg;
  --perspective: 1000px;
  position: absolute;
  width: var(--w);
  height: var(--h);
  top: 20%;
  left: calc(50% - (var(--w) / 2));
  transform-style: preserve-3d;
  transform: perspective(var(--perspective));
  animation: rotating 25s linear infinite;
}
@keyframes rotating {
  from {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0);
  }
  to {
    transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn);
  }
}

.card {
  position: absolute;
  border: 2px solid rgba(var(--color-card));
  border-radius: 12px;
  overflow: hidden;
  inset: 0;
  transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
  transition: transform 0.4s;
}

.img {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(var(--color-card), 0.2) 0%, rgba(var(--color-card), 0.6) 80%, rgba(var(--color-card), 0.9) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.first-content {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  transition: opacity 0.3s;
}

.second-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.4s;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.img:hover .first-content {
  opacity: 0;
}
.img:hover .second-content {
  opacity: 1;
}

.percent-text {
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}
</style>
