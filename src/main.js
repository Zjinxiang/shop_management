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
Vue.use(VueAxios, Axios)
//配置请求的根路径
Axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
//添加请求拦截，携带token值
Axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// Vue.prototype.$http=Axios

//导入vue-table-with-tree-grid表格树
import treeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', treeTable)

//导入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

//全局过滤器
Vue.filter('dataFormate', function (originVal) {
  let dt = new Date(originVal)

  let y = dt.getFullYear()
  let m = (dt.getMonth() + 1 + '').padStart(2, "0")
  let d = (dt.getDate() + '').padStart(2, "0")

  let hh = (dt.getHours() + '').padStart(2, "0")
  let mm = (dt.getMinutes() + '').padStart(2, "0")
  let ss = (dt.getSeconds() + '').padStart(2, "0")

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
