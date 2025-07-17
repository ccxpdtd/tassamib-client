<template>

  <!-- 页面 -->
  <div class="page">
    <ParticlesDemo :quantity="25" />

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
import {jwtDecode} from 'jwt-decode'
import Navbar from '../../../15_blog_test_2.0/src/components/Navbar.vue'
import ParticlesDemo from '../components/ParticlesDemo.vue'
import {mapState} from 'vuex'


export default {
  
  name: 'HomeDemo',
  components: {
    Navbar,
    ParticlesDemo,
  },
  computed:{
    ...mapState({
       uname: state => state.user.username
    }),
  },
  created() {
    const token = sessionStorage.getItem('token')
    if (token) {
      try {
        const payload = jwtDecode(token)
        this.$store.dispatch('setUser', payload)
      } catch (err) {
        console.error('Token 解析失败:', err)
        sessionStorage.removeItem('token')
      }
    }
  },


  methods:{
    async showRamOrMsgOrAtc(type){
      var url
      switch(type){
        case 'ram':
          url='/api/get_ramblings'
          break
        case 'msg':
          url='/api/message'
          break
        case 'atc':
          url='/api/articles'
          break
      }
      try{
        await this.$store.dispatch('get',url)
      }catch (err) {
        alert('请求失败')
        console.error(err)
      }
    },
    async deleteRamOrMsgOrAtc(type,target_id){
      const payload={target_id}
      var url
      switch(type){
        case 'ram':
          url='/api/delete_rambling'
          break
        case 'msg':
          url='/api/delete_message'
          break
        case 'atc':
          url='/api/delete_article'
          break
      }
      try {
        await this.$store.dispatch('post',{url,payload})
        this.$bus.$emit('showRamOrMsgOrAtc',type)
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
        this.$bus.$emit('showRamOrMsgOrAtc',type)
      } catch (err) {
        alert('请求失败')
        console.error(err)
      }
    },
  },
  
  mounted(){
    this.$bus.$on('deleteRamOrMsgOrAtc',this.deleteRamOrMsgOrAtc)
    this.$bus.$on('showRamOrMsgOrAtc',this.showRamOrMsgOrAtc)
    this.$bus.$on('publishRamOrMsg',this.publishRamOrMsg)
    // this.$bus.$on('handleLike',this.handleLike)

    this.$bus.$emit('showRamOrMsgOrAtc','msg')
    this.$bus.$emit('showRamOrMsgOrAtc','ram')
    this.$bus.$emit('showRamOrMsgOrAtc','atc')

    console.log('Home/mouted：',this.$store.state);
    
  },
  beforeDestroy(){
    this.$bus.$off('deleteRamOrMsgOrAtc',this.deleteRamOrMsgOrAtc)
    this.$bus.$off('showRamOrMsgOrAtc',this.showRamOrMsgOrAtc)
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
