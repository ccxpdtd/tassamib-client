<template>

  <!-- 页面 -->
  <div class="page">
    <!-- <ParticlesDemo :quantity="25" /> -->

    <!-- 导航栏 -->
    <div class="navbar-wrapper">
      <Navbar/>
    </div>

    <!-- 展示区 -->
    <div class="page-body">

      
      <router-view></router-view>

    </div>
  </div>

</template>

<script>
import 'animate.css'
import Navbar from '../../../15_blog_test_2.0/src/components/Navbar.vue'
// import ParticlesDemo from '../components/ParticlesDemo.vue'
import {mapState} from 'vuex'


export default {
  
  name: 'HomeDemo',
  components: {
    Navbar,
    // ParticlesDemo,
  },
  computed:{
    ...mapState({
       uname: state => state.user.username
    }),
  },
  created() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        this.$store.dispatch('setUser',payload)
      } catch (err) {
        console.error('Token 解析失败:', err)
      }
    }console.log('Home/mounted:store:',this.$store)
    
  },
  methods:{
    async showRamOrMsg(type){
      console.log('show',type);
      const url=type==='ram'?'/api/get_ramblings':'/api/message'
      try{
        await this.$store.dispatch('get',url)
      }catch (err) {
        alert('请求失败')
        console.error(err)
      }
    },
    async deleteRamOrMsg(type,target_id){
      const payload={target_id}
      const url=(type==='ram'?'/api/delete_rambling':'/api/delete_message')
      try {
        await this.$store.dispatch('post',{url,payload})
        this.$bus.$emit('showRamOrMsg',type)
      } catch (err) {
        alert('请求失败')
        console.error(err)
      }
    },
    async publishRamOrMsg(type,publish_data){
    
      var url
      const payload=publish_data
      switch(type){
        case 'ram':
          url='/api/publish_rambling'
          break
        case 'msg':
          url='/api/publish_message'
          break
        case 'cmt':
          url='/api/publish_message'
          break
      }
      try {
        await this.$store.dispatch('post',{url,payload})
        this.$bus.$emit('showRamOrMsg',type)
      } catch (err) {
        alert('请求失败')
        console.error(err)
      }
    },
  },
  
  mounted(){
    this.$bus.$on('deleteRamOrMsg',this.deleteRamOrMsg)
    this.$bus.$on('showRamOrMsg',this.showRamOrMsg)
    this.$bus.$on('publishRamOrMsg',this.publishRamOrMsg)
    // this.$bus.$on('handleLike',this.handleLike)

    this.$bus.$emit('showRamOrMsg','msg')
    this.$bus.$emit('showRamOrMsg','ram')
  },
  beforeDestroy(){
    this.$bus.$off('deleteRamOrMsg',this.deleteRamOrMsg)
    this.$bus.$off('showRamOrMsg',this.showRamOrMsg)
    this.$bus.$off('publishRamOrMsg',this.publishRamOrMsg)
    // this.$bus.$off('handleLike',this.handleLike)
  },
}
</script>

<style scoped>
.page {
  display: flex;
  height: 100vh; /* 全屏高度 */
}
html{
  overflow: hidden;
}
.navbar-wrapper {
  width: 18%; /* 你可以改成你想要的比例，例如 20%、15% */
  position: fixed; /* 固定在页面 */
  left: 0;
  top: 0;
  height: 100vh;
}


.page-body {
  margin-left: 18%; /* 留出导航栏宽度 */
  width:82%;
  height:100vh;

}


</style>
