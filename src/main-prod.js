import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
//导入字体icon
import '@/assets/css/fonts/iconfont.css'
import "./assets/css/common.less";
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'


axios.defaults.baseURL = 'http://106.53.73.30:8888/api/private/v1'
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)

  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {

  return config
})
Vue.prototype.$http = axios



Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(ZkTable)
Vue.use(VueQuillEditor)
//全局时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//商品审核状态
Vue.filter('productReview',function (originVal) {
  if (originVal===0) return '已审核'
  return '未审核'
})





new Vue({
  router,
  store,
  axios,
  render: function (h) { return h(App) }
}).$mount('#app')
