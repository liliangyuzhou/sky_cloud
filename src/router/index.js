import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index';
import HelloWorld from "@/components/HelloWorld1";
import login from "../components/login";


Vue.use(Router)

export default new Router({
  // mode配置的是vue的路由模式
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/test',
      name: 'HelloWorld1',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
  ]
})
