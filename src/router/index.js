import VueRouter from 'vue-router'

import Home from '../layout/index.vue'
import LoginRegister from '../views/login/index.vue'

import BlogCard from '../views/articles/index.vue'
// import OrbitLineAvatar from '../components/OrbitLineAvatar.vue'
import MessageBoard from '../views/messages/index.vue'


import ArticleDetail from '../views/articles/detail/index.vue'
import Ramblings from '../views/ramblings/index.vue'
import tassamib from '../views/tassamib/index.vue'


const router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: Home,
      // meta: { requiresAuth: true },
      children: [
        {
          path: 'blogger_home',
          component: tassamib,
        },
        {
          path: 'message',
          component: MessageBoard,
        },
        {
          path: 'ramblings',
          component: Ramblings,
        },
        {
          path: 'articles',
          component: BlogCard,
        },
        {
          path: 'article_detail',
          name: 'myArticleDetail',
          component: ArticleDetail,
        },

      ]
    },
    {
      path: '/',
      redirect: '/home/blogger_home'
    },
    {
      path: '/login',
      component: LoginRegister,
    },
  ],
})


export default router