module.exports = {
  devServer: {
    port: 80,
    proxy: {
      '/api': {
        target: 'http://localhost:9001', // 后端地址
        changeOrigin: true,
        pathRewrite: { '^/api': '' } // 核心配置：抹去 /api 前缀
      }
    }
  }
}
