module.exports = {
  devServer: {
    port: 9002,
    proxy: {
      '/api': {
        target: 'http://localhost:9001', // 后端地址
        changeOrigin: true
      }
    }
  }
}
