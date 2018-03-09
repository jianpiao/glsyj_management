import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/page/login/Login.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/other/Readme.vue'], resolve)
                },
                {
                    path: '/basetable',
                    component: resolve => require(['../components/page/other/BaseTable.vue'], resolve)
                },
                {
                    path: '/userInfo',
                    component: resolve => require(['../components/page/admin/userInfo.vue'], resolve)     // 用户列表
                },
                {
                    path: '/userList',
                    component: resolve => require(['../components/page/user/userList.vue'], resolve)
                }, 
                {
                    path: '/related',
                    component: resolve => require(['../components/page/user/related.vue'], resolve)
                },
                {
                    path: '/openShop',
                    component: resolve => require(['../components/page/user/openShop.vue'], resolve)
                },
                {
                    path: '/shopList',
                    component: resolve => require(['../components/page/shop/shopList.vue'], resolve)
                },
                {
                    path: '/recommend',
                    component: resolve => require(['../components/page/shop/recommend.vue'], resolve)
                },
                {
                    path: '/commodityList',
                    component: resolve => require(['../components/page/commodity/commodityList.vue'], resolve)
                }, 
                {
                    path: '/classification',
                    component: resolve => require(['../components/page/classification/classification.vue'], resolve)
                }, 
                {
                    path: '/shopClassification',
                    component: resolve => require(['../components/page/classification/shopClassification.vue'], resolve)
                }, 
                {
                    path: '/faceback',
                    component: resolve => require(['../components/page/faceback/faceback.vue'], resolve)
                },
                {
                    path: '/vueeditor',
                    component: resolve => require(['../components/page/other/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/markdown',
                    component: resolve => require(['../components/page/other/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
                },
                {
                    path: '/upload',
                    component: resolve => require(['../components/page/other/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
                },
                {
                    path: '/basecharts',
                    component: resolve => require(['../components/page/other/BaseCharts.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/drag',
                    component: resolve => require(['../components/page/other/DragList.vue'], resolve)    // 拖拽列表组件
                }
            ]
        },
        {
            path: '/login',
            component: Login
        },
    ]
})
