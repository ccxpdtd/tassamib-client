import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
//应用vuex插件
Vue.use(Vuex)

const actions = {
  setUser(context, value) {
    context.commit('SETUSER', value)
  },
  async post(context, value) {

    try {
      const res = await axios.post(value.url, value.payload)
      console.log('post请求结束', res.data)
      return res.data // ✅ 返回响应数据
    } catch (err) {
      console.error(err)
      throw err // ✅ 抛出错误，让组件处理
    }
  },
  async get(context, url) {
    try {
      const res = await axios.get(url)
      console.log('get请求结束', res.data)

      if (url === '/api/message')
        context.commit('SETCOMMENTS', res.data)
      else if (url === '/api/articles')
        context.commit('SETARTICLES', res.data)
      else if (url === '/api/get_ramblings')
        context.commit('SETRAMBLINGS', res.data)

      return res.data.ok // ✅ 返回响应数据
    } catch (err) {
      console.error(err)
      throw err // ✅ 抛出错误，让组件处理
    }
  }
}

const mutations = {
  SETUSER(state, value) {
    state.user = value
  },

  SETCOMMENTS(state, value) {
    state.messages = [...value.data];
  },
  SETARTICLES(state, value) {
    state.articles = value.data;
  },
  SETRAMBLINGS(state, value) {
    state.ramblings = [...value.data]  // ✅ 用新引用确保触发响应
  }

}

const state = {
  user: {},
  messages: [],
  articles: [],
  ramblings: [],
}

export default new Vuex.Store({
  actions, mutations, state
})