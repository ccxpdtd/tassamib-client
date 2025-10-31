import axios from 'axios'

// 模块内局部状态
const state = {
  messages: [] // 消息列表
}

// 模块内同步修改方法
const mutations = {
  SET_MESSAGES(state, value) {
    state.messages = [...value.data]
  }
}

// 模块内异步操作（含独立请求逻辑）
const actions = {
  // 获取消息列表
  async getMessages({ commit }) {
    try {
      const res = await axios.get('/api/get_messages')
      commit('SET_MESSAGES', res.data)
      return res.data
    } catch (err) {
      console.error('获取消息失败', err)
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
