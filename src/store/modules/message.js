import request from "../../api/request";

// 模块内局部状态
const state = {
  messages: [] // 消息列表
}

// 模块内同步修改方法
const mutations = {
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
}

// 模块内异步操作（含独立请求逻辑）
const actions = {
  async message_post(context, { url, payload }) {
    try {
      const res = await request.post(url, payload)
      console.log('post请求结束', res)
      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async message_get(context, url) {
    try {
      const res = await request.get(url)
      console.log('get请求结束', res)
      context.dispatch('switchUrl', { url, res })
      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  switchUrl(context, { url, res }) {
    switch (url) {
      case '/api/get_messages':
        context.commit('SET_MESSAGES', res.messages)
        break
    }
  }
}

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
