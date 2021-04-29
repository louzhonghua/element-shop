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

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme




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
