import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Results from '@/views/Results'
import Trendings from '@/views/Trendings'
import Locations from '@/views/Locations'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/results',
      name: 'Results',
      component: Results
    },
    {
      path: '/trendings',
      name: 'Trendings',
      component: Trendings
    },
    {
      path: '/locations',
      name: 'Locations',
      component: Locations
    }
  ]
})
