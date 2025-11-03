// src/api/request.ts
import axios from 'axios';
import { Notification } from 'element-ui';


// 创建 Axios 实例
const request = axios.create({
  // baseURL: 'http://localhost:9001', // 接口基础路径
  timeout: 5000, // 请求超时时间
  headers: { 'Content-Type': 'application/json' } // 默认请求头
});


// 请求拦截器：携带 Token（从 localStorage 获取）
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取 Token，无需依赖 Vuex
    const token = localStorage.getItem('token');
    if (token) {
      // Token 格式：Bearer + 空格 + Token 值（后端需对应解析）
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    Notification.error('请求发送失败');
    return Promise.reject(err);
  }
);

// 响应拦截器：统一处理响应数据和错误
request.interceptors.response.use(
  // 成功响应：直接返回响应体（跳过 axios 外层包装）
  (res) => res.data,
  // 错误响应：统一处理状态码和提示
  (err) => {
    // 处理 401 未授权（Token 过期/无效）
    if (err.response?.status === 401) {
      const errorMsg = err.response?.data?.msg || '未授权访问，请重新登录';
      // 若 Token 过期，清空本地存储的 Token
      if (errorMsg.includes('过期')) {
        localStorage.removeItem('token');
        // 可在此处添加跳转登录页逻辑（如：window.location.href = '/login'）
      }
      Notification.warning(errorMsg);
    } else {
      // 其他错误：显示通用提示
      const errorMsg = err.response?.data?.msg || '请求失败，请稍后重试';
      console.log('err', err);

      Notification.error(errorMsg);
    }
    return Promise.reject(err);
  }
);

// 导出常用请求方法（get/post）
export default {
  // GET 请求：支持传递 URL 和参数配置
  get(url, config) {
    return request.get(url, config);
  },
  // POST 请求：支持传递 URL 和请求体数据
  post(url, data) {
    return request.post(url, data);
  }
};

