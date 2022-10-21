import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

 // 导入js文件
import ProjectConfig from './utils/config.js'
 // 挂载
Vue.prototype.$ProjectConfig = ProjectConfig

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
