import VueRouter from 'vue-router'

import Home from '../page/Home.vue'
import LoginRegister from '../page/LoginRegister.vue'

import BlogCard from '../page/BlogCard.vue'
// import OrbitLineAvatar from '../components/OrbitLineAvatar.vue'
import MessageBoard from '../page/MessageBoard.vue'

import ArticleUploader from '../page/ArticleUploader.vue'
import ArticleList from '../page/ArticleList.vue'
import Ramblings from '../page/Ramblings.vue'
import tassamib from '../page/tassamib.vue'


const router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: Home,
      meta: { requiresAuth: true },
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
          name: 'ArticleList',
          component: ArticleList,
        },
        {
          path: 'article_upload',
          component: ArticleUploader,
        },
      ]
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginRegister,
    },
  ],
})


export default router