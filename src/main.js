import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index.js'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
//引入api 设为全局变量
import API from 'api/api.js'

Vue.use(ElementUI);
//  使用api接口
Vue.use(API)

Vue.prototype.$axios = axios;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');