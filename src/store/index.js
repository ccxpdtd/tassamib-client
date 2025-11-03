import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'       // 导入用户模块
import article from './modules/article' // 导入文章模块
import message from './modules/message' // 导入消息模块
import rambling from './modules/rambling' // 导入消息模块

// 应用 Vuex 插件
Vue.use(Vuex)

// 根仓库（仅组合模块，不存储具体业务状态）
export default new Vuex.Store({
  modules: {
    user,       // 注册用户模块（命名空间：user）
    article,    // 注册文章模块（命名空间：article）
    message,     // 注册消息模块（命名空间：message）
    rambling
  }
})
