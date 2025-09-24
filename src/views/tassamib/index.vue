<template>
  <div class="tassamib-container">

    <div class="row">
      <div class="tassamib-card skill">
        <SkillEnergy></SkillEnergy>
      </div>
    </div>
    <div class="row">
      <div class="tassamib-card avatar">
        <AvatarCircle></AvatarCircle>
      </div>
    </div>
    <!-- <div>
      <MusicCard></MusicCard>
    </div> -->


  </div>

</template>

<script>
import AvatarCircle from './avatarCircle/index.vue'
import SkillEnergy from './skills/index.vue'
export default {
  name: "TassamibDemo",
  components: {
    AvatarCircle,
    SkillEnergy,
  }
};
</script>

<style scoped>
.tassamib-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* padding: 50px 60px; */
}

.row {
  display: flex;
}

.tassamib-card {
  display: inline-block;
  justify-items: center;
  padding: 13px;
  background: rgba(250, 250, 250, 0.7);
  border: 1px solid rgb(233, 233, 233);
  border-radius: 20px;
  transition: transform 0.2s;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);
}

.tassamib-card:hover {
  transform: scale(1.03);
}


.tassamib-card.avatar {
  width: 520px;
  height: 520px;
  /* margin: 0 40px 80px; */
  margin: 0 auto;
}

.tassamib-card.skill {
  width: 920px;
  margin: 0 auto 40px;
}
</style>
