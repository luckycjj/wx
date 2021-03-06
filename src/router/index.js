import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login'
import signIn from '../pages/signIn'
import search from '../pages/search'
import orderMore from '../pages/orderMore'
import histroySearch from '../pages/histroySearch'
import orderList from '../pages/orderList'
Vue.use(Router)
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
});
Vue.filter('time',function (time,type) {
  var list0 = time.split(" ");
  var list1 = list0[0].split("-");
  var list2 = list0[1].split(":");
  list1.splice(0,1);
  list2.splice(2,1);
  if(type == 0 ){
    return list1.join("-");
  }else{
    return list2.join(":");
  }
})
Vue.filter('checkTel',function (val) {
  var len = val.length;
  var num1 = val.substring(0,3);
  var num2 = val.substring(len - 4);
  var num3 = "";
  for(var  i  = 0  ; i < len - 7 ; i++){
      num3 += "*";
  }
  return  num1 + num3 + num2
})
export default new Router({
  routes: [
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/histroySearch',
      name: 'histroySearch',
      component: histroySearch
    },
    {
      path: '/orderMore',
      name: 'orderMore',
      component: orderMore
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn
    },
    {
      path: '/search',
      name: 'search',
      component: search
    }
  ]
})
