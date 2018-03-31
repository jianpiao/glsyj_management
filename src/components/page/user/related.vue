/** 
    关联店铺
**/
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 店铺管理</el-breadcrumb-item>
                <el-breadcrumb-item>店铺列表</el-breadcrumb-item>
                 <el-breadcrumb-item>用户关联(取和用户有关联的店铺信息)</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-arrow-left" @click="backPage">< 返回列表</el-button>
        </div>
        <el-table
            :data="shopInfo"
            style="width: 100%"
            :default-sort = "{prop: 'shop_id', order: 'descending'}">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="店铺ID">
                            <span>{{ props.row.shop_id }}</span>
                        </el-form-item>
                        <el-form-item label="店铺分类ID">
                            <span>{{ props.row.shop_category_id }}</span>
                        </el-form-item>
                        <el-form-item label="店铺分类名称">
                            <span>{{ props.row.shop_category_name }}</span>
                        </el-form-item>
                        <el-form-item label="店铺名称">
                            <span>{{ props.row.shop_name }}</span>
                        </el-form-item>
                        <el-form-item label="店铺照片">
                            <template scope="scope">
                                <el-button size="small"
                                    @click="showPhone('店铺照片',props.row.shop_image)" 
                                    >
                                    {{ props.row.shop_image | img }}
                                </el-button>
                            </template>
                        </el-form-item>
                        <el-form-item label="店铺背景图">
                             <template scope="scope">
                                <el-button size="small"
                                    @click="showPhone('店铺背景图',props.row.back_image)" 
                                    >
                                    {{ props.row.back_image | img }}
                                </el-button>
                            </template>
                        </el-form-item>
                        <el-form-item label="商品简介">
                            <span>{{ props.row.synopsis }}</span>
                        </el-form-item>
                        <el-form-item label="店铺地址">
                            <span>{{ props.row.address }}</span>
                        </el-form-item>
                        <el-form-item label="店铺过期时间">
                            <span>{{ props.row.expiration_date }}</span>
                        </el-form-item>
                        <el-form-item label="营业状态">
                            <span>{{ props.row.shop_state | shopState}}</span>
                        </el-form-item>
                        <el-form-item label="拥有权限">
                            <span>{{ props.row.authority | auth}}</span>
                        </el-form-item>
                        <el-form-item label="店铺禁闭状态">
                            <span>{{ props.row.encage | encageState }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="店铺ID"
                prop="shop_id"
                width="80"
                sortable>
            </el-table-column>
            <el-table-column
                label="店铺名称"
                prop="shop_name"
                width="120">
            </el-table-column>
            <el-table-column
                label="店铺地址"
                prop="address"
                width="220">
            </el-table-column>
            <el-table-column
                label="过期时间"
                prop="expiration_date">
            </el-table-column>
            <el-table-column
                label="拥有权限"
                prop="authority">
                 <template scope="scope">
                    {{ scope.row.authority | auth }}
                </template>
            </el-table-column>
            <el-table-column
                label="店铺禁闭状态"
                prop="encage">
                <template scope="scope">
                    {{ scope.row.encage | encageState }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                shopInfo: ''
            }
        },
        created () {
            this.getData()
        },
        methods: {
            getData(i){
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'UserIdGetShopList',
                    data: {
                        account_id: self.$store.getters.userID
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.shopInfo = res.data.data
                })
            },
            backPage() {
                this.$router.go(-1)
            }
        },
        filters: {
            img(v) {
                return v == '' ? '查看' : '空'
            },
            auth(v) {
                if (v == 1) {
                    return '订单管理'
                } else if (v == 2) {
                    return '店铺信息管理'
                } else if (v == 3) {
                    return '商品管理'
                } else if (v == 4) {
                    return '统计管理'
                } else if (v == 5) {
                    return '子账号管理权'
                }
            },
            shopState(v) {
                return v == 1 ? '营业' : '关闭'
            },
            encageState(v) {
                return v == 1 ? '正常' : '封闭'
            }
        }
    }
</script>

<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
