<template>
  <div class="page">
    <div class="page-left">
      <Messages></Messages>
    </div>
<!--     <div class="page-right">
      <Blogger></Blogger>
      <NotificationList></NotificationList>
    </div> -->
  </div>
</template>

<script>
import Messages from '../components/Messages.vue'
// import Blogger from '../components/Blogger.vue'
// import NotificationList from '../components/NotificationList.vue'
export default {
  name:'MessageBoard',
  components:{
    Messages,
    // Blogger,
    // NotificationList,
  }
}
</script>

<style scoped>
.page{
  margin-top: 25px;
  display: flex;
  flex-direction: row;

}
.page-left{
  width:90%;
  margin:0 auto;
}
/* .page-right{
  flex:1;
} */
</style>