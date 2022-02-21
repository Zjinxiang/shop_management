import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入全局样式
import '../src/assets/css/Global.css'

//导入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//导入axios
import Axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios,Axios)
//配置请求的根路径
Axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'
//添加请求拦截，携带token值
Axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
// Vue.prototype.$http=Axios

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
