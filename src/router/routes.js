import Layout from '../layout/index.vue'

import LoginRegister from '../views/login/index.vue'
import Home from '../views/main/home/index.vue'

import Articles from '../views/main/articles/index.vue'
import Messages from '../views/main/messages/index.vue'

import ArticleDetail from '../views/main/articles/detail/index.vue'
import Ramblings from '../views/main/ramblings/index.vue'

export const myRoutes = [
  {
    path: '/',
    redirect: '/home',
    name: 'myLayout',
    component: Layout,
    meta: {
      title: '',
      hidden: false,
      requireLoginAuth: false,
    },
    children: [
      {
        path: 'home',
        name: 'myHome',
        component: Home,
        meta: {
          title: '首页',
          hidden: false,
        },
      },
      {
        path: 'articles',
        name: 'myArticles',
        component: Articles,
        meta: {
          title: '博客',
          hidden: false,
        },
      },
      {
        path: 'articledetail',
        name: 'myArticleDetail',
        component: ArticleDetail,
        meta: {
          title: '文章详情',
          hidden: true,
        },
      },

      {
        path: 'ramblings',
        name: 'myRamblings',
        component: Ramblings,
        meta: {
          title: '碎碎念',
          hidden: false,
          requireLoginAuth: true,
        },
      },
      {
        path: 'messages',
        name: 'myMessages',
        component: Messages,
        meta: {
          title: '留言板',
          hidden: false,
        },
      },
    ]
  },

  {
    path: '/login',
    name: 'myLoginRegister',
    component: LoginRegister,
    requireLoginAuth: false,
  },

]