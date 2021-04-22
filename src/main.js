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

Vue.config.productionTip = false
Vue.use(ElementUI);



new Vue({
  router,
  store,
  axios,
  render: function (h) { return h(App) }
}).$mount('#app')
