<template>
  <div class="tassamib-page">
    
    <div class="first-row">
      <div class="message-card orbit" >
        <OrbitLineAvatar></OrbitLineAvatar>
      </div>
      <div>
        <MusicCard></MusicCard>
      </div>
      
    </div>
    
<!--     <div class="message-card two" >
        <Blogger></Blogger>
      </div> -->

    <div class="message-card skill" >
      <SkillEnergy></SkillEnergy>
    </div>

      
    
  </div>

</template>

<script>
import OrbitLineAvatar from '../components/OrbitLineAvatar.vue'
import SkillEnergy from '../components/SkillEnergy.vue'
import MusicCard from '../components/MusicCard.vue'
// import Blogger from '../components/Blogger.vue'
export default {
  name: "TassamibDemo",
  components:{
    OrbitLineAvatar,
    SkillEnergy,
    MusicCard,
    // Blogger
  }
};
</script>

<style scoped>
.tassamib-page{
  display: flex;
  flex-direction: column;
  padding:50px 60px;
}

.message-card {
  display: inline-block;
  justify-items: center;
  background: rgba(250, 250, 250, 0.7);
  border:1px solid rgb(233, 233, 233);
  padding: 10px;
  border-radius: 20px;

  transition: transform 0.2s;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03),
              0 2px 4px rgba(0, 0, 0, 0.05),
              0 12px 24px rgba(0, 0, 0, 0.05);

}
.first-row{
  display: flex;
}
.message-card.orbit{
  width: 520px;
  height:520px;
  margin:0 40px 80px;
}
.message-card.skill{
  width: 920px;
  margin:20px auto;
}

.message-card:hover {
  transform: scale(1.03);
}


</style>
