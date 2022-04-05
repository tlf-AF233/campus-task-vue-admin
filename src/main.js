import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets



import echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import request from '@/utils/request'

import '../public/ueditor/ueditor.config.js'
import '../public/ueditor/ueditor.all.js'
import '../public/ueditor/lang/zh-cn/zh-cn.js'
import '../public/ueditor/themes/default/css/ueditor.css'


import '@/icons' // icon
import '@/permission' // permission control


Vue.use(ElementUI, { locale })

Vue.prototype.req = request
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false



new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
