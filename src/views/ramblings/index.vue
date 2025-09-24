<template>
  <div class="rambling-container">
    <div class="user-profile">
      <UserProfile></UserProfile>
    </div>

    <div class="publish-ramblings" v-show='role === "admin"'>
      <PubRamblings></PubRamblings>
    </div>
    <div class="rambling-card" v-for="ram in ramblings" :key="ram.id">
      <RamblingsCard :id="ram.id" :content="ram.content" :date="ram.created_at" :img_url="ram.img_url"
        :like_count="ram.like_count" />
    </div>
  </div>
</template>

<script>
import UserProfile from './userProfile/index.vue'
import RamblingsCard from './ramblings/index.vue'
import PubRamblings from './pubulish/index.vue'
import { mapState } from 'vuex'
export default {
  name: 'TestDemo',
  data() {
    return {

    }
  },
  components: {
    UserProfile,
    RamblingsCard,
    PubRamblings
  },
  computed: {
    ...mapState(['ramblings']),  // 直接绑定 Vuex 的 ramblings
    ...mapState({
      role: state => state.user.role
    })
  },
  mounted() {
    this.$store.dispatch('get', '/api/get_ramblings')
  },

}
</script>

<style scoped>
.rambling-container {
  max-width: 800px;
  height: 100%;

  margin: 0 auto;
  padding-bottom: 120px;

  display: flex;
  flex-direction: column;
  gap: 50px;
}

/* .user-profile {}

.publish-ramblings {}

.rambling-card {} */
</style>