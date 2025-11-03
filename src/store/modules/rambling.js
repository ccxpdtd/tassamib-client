import request from "../../api/request"

// 模块内局部状态
const state = {
  ramblings: [],
}

// 模块内同步修改方法
const mutations = {
  SET_RAMBLINGS(state, ramblings) {
    state.ramblings = ramblings
  },
}

// 模块内异步操作（含独立请求逻辑）
const actions = {
  async rambling_post(context, { url, payload }) {
    try {
      const res = await request.post(url, payload)
      console.log('post请求结束', res)
      return res // ✅ 返回响应数据
    } catch (err) {
      console.error(err)
      throw err // ✅ 抛出错误，让组件处理
    }
  },
  async rambling_get(context, url) {
    try {
      const res = await request.get(url)
      console.log('get请求结束', res)
      context.dispatch('switchUrl', { url, res })
      return res // ✅ 返回响应数据
    } catch (err) {
      console.error(err)
      throw err // ✅ 抛出错误，让组件处理
    }
  },

  switchUrl(context, { url, res }) {
    switch (url) {
      case '/api/get_ramblings':
        context.commit('SET_RAMBLINGS', res.ramblings)
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
