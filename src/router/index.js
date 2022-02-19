import Vue from 'vue'
import VueRouter from 'vue-router'

//导入登录组件
import Login from '../components/Login.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:()=>import('../components/Home.vue')
  }
]

const router = new VueRouter({
  routes
})

//路由守卫
router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next();
  //获取tokrn
  let tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login');
  return next()
})

export default router
