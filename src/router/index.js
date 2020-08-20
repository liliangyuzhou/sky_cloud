import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index';
import HelloWorld from "@/components/HelloWorld1";
import login from "../components/login";
import service from "../components/service/services";
import interfaces from "../components/interface/interface";
import interface_list from "../components/interface/interface_list";
import task_list from "../components/task/task_list";

Vue.use(Router)

export default new Router({
  // mode配置的是vue的路由模式
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'default',
      redirect:'/index/1'
    },
    {
      path: '/index/:tab',
      name: 'index',
      component: index,
      props:true, //必须要写的，才可以外部tab进组件index中去
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
    {
      path: '/service',
      name: 'service',
      component: service
    },
    {
      path: '/add/interface',
      name: 'interface',
      component: interfaces,
      props: true,
    },
    {
      path: '/edit/interface',
      name: 'interface',
      component: interfaces,
      props: true,
    },

    {
      path: '/task/list',
      name: 'task_list',
      component:task_list,
      props: true,
    },
  ]
})
