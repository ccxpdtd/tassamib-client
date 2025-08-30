<template>
  <div class="moments-page">
    <div class="user-profile">
      <UserProfile></UserProfile>
    </div>

    <div v-show='role==="admin"'>
      <PubRamblings></PubRamblings>
    </div>
    <div class="cards" v-for="ram in ramblings" :key="ram.id">
      <RamblingsCard 
        :id="ram.id"
        :content="ram.content"
        :date="ram.created_at"
        :img_url="ram.img_url"
        :like_count="ram.like_count"
      />
    </div>
  </div>
</template>

<script>
import UserProfile from '../components/UserProfile.vue'
import RamblingsCard from '../components/RamblingsCard.vue'
import PubRamblings from '../components/PubRamblings.vue'
import { mapState } from 'vuex'
// import ButtMomentsPublish from '../components/BtnMomentsPublish.vue'
export default {
  name:'TestDemo',
  data(){
    return{

    }
  },
  components:{
    UserProfile,
    RamblingsCard,
    // ButtMomentsPublish,
    PubRamblings
  },
  computed: {
    ...mapState(['ramblings']),  // 直接绑定 Vuex 的 ramblings
    ...mapState({
       role: state => state.user.role
    })
  },
  methods:{

  },
  mounted(){
    this.$bus.$emit('handleGet','/api/get_ramblings')
  },
  beforeDestroy(){
    
  },
}
</script>

<style scoped>
.moments-page{
  max-width: 800px;
  margin: 45px auto;
  padding-bottom: 120px;
  height:100%;
  display: flex;
  flex-direction: column;
  
}
.user-profile{
  margin-bottom:auto;
}

.cards{
  margin:30px 0;
}

</style>