import axios from 'axios'

// 模块内局部状态（仅存储用户相关数据）
const state = {
  user: {}
}

// 模块内同步修改方法
const mutations = {
  SET_USER(state, value) {
    state.user = value
  }
}

// 模块内异步操作（含独立请求逻辑）
const actions = {
  // 设置用户信息
  setUser({ commit }, value) {
    commit('SET_USER', value)
  },
  // 登录请求（模块内独立封装 axios）
  async login({ commit }, loginForm) {
    try {
      const res = await axios.post('/api/login', loginForm)
      commit('SET_USER', res.data.user)
      return res.data
    } catch (err) {
      console.error('登录请求失败', err)
      throw err
    }
  }
}

export default {
  namespaced: true, // 开启命名空间，避免模块间冲突
  state,
  mutations,
  actions
}
