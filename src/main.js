import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
import router from './router/index.js'
import store from './store/index.js'
Vue.use(VueRouter)


new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
    // console.log(Vue.prototype);

  }
}).$mount('#app')
