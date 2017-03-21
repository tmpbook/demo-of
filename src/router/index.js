import Vue from 'vue'
import Router from 'vue-router'
import FirstDisplay from '@/pages/FirstDisplay'
import SecondDisplay from '@/pages/SecondDisplay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/FirstDemoDisplay',
      name: 'FirstDemoDisplay',
      component: FirstDisplay
    },
    {
      path: '/SecondDemoDisplay',
      name: 'SecondDemoDisplay',
      component: SecondDisplay
    },
    { path: '*', redirect: '/FirstDemoDisplay' }
  ]
})
