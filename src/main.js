// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import { LoadingPlugin } from 'vux'
import router from './router'
import Vue from 'vue'
import App from './App'

Vue.use(LoadingPlugin)
Vue.use(VueRouter)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
