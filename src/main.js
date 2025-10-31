import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
import router from './router/index.js'
Vue.use(VueRouter)

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import store from './store/index.js'

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
    // console.log(Vue.prototype);

  }
}).$mount('#app')
