import VueRouter from 'vue-router'
import { myRoutes } from './routes'


const router = new VueRouter({
  routes: myRoutes
})

router.beforeEach((to, from, next) => {
  // 判断目标路由是否需要登录
  if (to.meta.requireLoginAuth) {
    // 获取本地 token
    const token = localStorage.getItem('token')
    if (token) {
      // 有 token，放行
      next()
    } else {
      // 无 token，强制跳转到登录页
      // next({ path: '/login' })
      alert('请先登录')
    }
  } else {
    // 不需要权限的路由，直接放行
    next()
  }
})

export default router