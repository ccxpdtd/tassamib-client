import axios from 'axios'
import request from '../../api/request'

// 模块内局部状态（仅存储用户相关数据）
const state = {
}

// 模块内同步修改方法
const mutations = {
}

// 模块内异步操作（含独立请求逻辑）
const actions = {
  setUser(context, value) {
    context.commit('SET_USER', value)
  },
  async user_post(context, { url, payload }) {
    try {
      const res = await request.post(url, payload)
      console.log('post请求结束', res)
      return res // ✅ 返回响应数据
    } catch (err) {
      console.error(err)
      throw err // ✅ 抛出错误，让组件处理
    }
  },
  async user_get(context, { url, payload }) {
    try {
      const res = await axios.get(url, payload ? { params: { ...payload } } : undefined);
      console.log('get请求结束', res.data)
      return res.data // ✅ 返回响应数据
    } catch (err) {
      console.error(err)
      throw err // ✅ 抛出错误，让组件处理
    }
  },
}

export default {
  namespaced: true, // 开启命名空间，避免模块间冲突
  state,
  mutations,
  actions
}
