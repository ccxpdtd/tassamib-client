import axios from 'axios'

// 模块内局部状态
const state = {
  articles: [],  // 文章列表
  ramblings: []  // 随笔列表
}

// 模块内同步修改方法
const mutations = {
  SET_ARTICLES(state, value) {
    state.articles = [...value.data] // 新数组确保响应式更新
  },
  SET_RAMBLINGS(state, value) {
    state.ramblings = [...value.data]
  }
}

// 模块内异步操作（含独立请求逻辑）
const actions = {
  // 获取文章列表
  async getArticles({ commit }) {
    try {
      const res = await axios.get('/api/get_articles')
      commit('SET_ARTICLES', res.data)
      return res.data
    } catch (err) {
      console.error('获取文章失败', err)
      throw err
    }
  },
  // 获取随笔列表
  async getRamblings({ commit }) {
    try {
      const res = await axios.get('/api/get_ramblings')
      commit('SET_RAMBLINGS', res.data)
      return res.data
    } catch (err) {
      console.error('获取随笔失败', err)
      throw err
    }
  }
}

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
