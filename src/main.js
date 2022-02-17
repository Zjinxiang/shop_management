import Vue from 'vue'
import App from './App.vue'
import router from './router'

//导入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//导入axios
import Axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(Axios,VueAxios)

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
