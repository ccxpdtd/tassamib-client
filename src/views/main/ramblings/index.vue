<template>
  <div class="rambling-container">
    <div class="user-profile">
      <UserProfile></UserProfile>
    </div>

    <div class="publish-ramblings" v-show="isAdmin()">
      <PubRamblings></PubRamblings>
    </div>
    <div class="rambling-card">
      <RamblingList></RamblingList>
    </div>
  </div>
</template>

<script>
import parseToken from '../../../util/parseToken'
import UserProfile from './userProfile/index.vue'
import RamblingList from './list/index.vue'
import PubRamblings from './pubulish/index.vue'

export default {
  name: 'TestDemo',
  components: {
    UserProfile,
    RamblingList,
    PubRamblings
  },


  methods: {
    isAdmin() {
      const user = parseToken(localStorage.getItem('token'))
      if (!user) return false
      else return user.role === 'admin' ? true : false
    },

  }

}
</script>

<style scoped>
.rambling-container {
  max-width: 700px;
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