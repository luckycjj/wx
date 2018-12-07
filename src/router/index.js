import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login'
import signIn from '../pages/signIn'
Vue.use(Router)
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
   /* document.getElementById('title').innerText = document.title*/
  }
});

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn
    }
  ]
})
