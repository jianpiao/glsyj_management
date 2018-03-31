<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'iconfont icon-shuoming',
                        index: 'readme',
                        title: '项目介绍'
                    },
                    {
                        icon: 'iconfont icon-guanlikehu',
                        index: 'userInfo',
                        title: '管理员管理'
                    },
                    {
                        icon: 'iconfont icon-shenhekuanxiang',
                        index: 'withdraw',
                        title: '取款审核'
                    },
                    // {
                    //     icon: 'el-icon-date',
                    //     index: '3',
                    //     title: '表单',
                    //     subs: [
                    //         {
                    //             index: 'vueeditor',
                    //             title: '编辑器'
                    //         },
                    //         {
                    //             index: 'markdown',
                    //             title: 'markdown'
                    //         },
                    //         {
                    //             index: 'upload',
                    //             title: '文件上传'
                    //         }
                    //     ]
                    // },
                    {
                        icon: 'iconfont icon-renyuandangan',
                        index: 'userList',
                        title: '用户管理'
                    },
                    {
                        icon: 'iconfont icon-msnui-shop',
                        index: '3',
                        title: '店铺管理',
                        subs: [
                            {
                                index: 'shopList',
                                title: '店铺列表'
                            },
                            {
                                index: 'recommend',
                                title: '店铺推广'
                            }
                        ]
                    },
                     {
                        icon: 'iconfont icon-shangpin-',
                        index: 'commodityList',
                        title: '商品管理'
                    },
                     {
                        icon: 'iconfont icon-fenlei',
                        index: '7',
                        title: '分类管理',
                        subs: [
                            {
                                index: 'classification',
                                title: '商品(系统)分类'
                            },
                            {
                                index: 'shopClassification',
                                title: '店铺分类'
                            }
                        ]
                    },
                    {
                        icon: 'iconfont icon-msnui-complain',
                        index: 'faceback',
                        title: '投诉管理'
                    }
                    // {
                    //     icon: 'el-icon-picture',
                    //     index: 'basecharts',
                    //     title: '图表'
                    // },
                    // {
                    //     icon: 'el-icon-upload2',
                    //     index: 'drag',
                    //     title: '拖拽'
                    // }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/icon/iconfont.css";
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
