/** 
    店铺管理
    店铺列表
**/
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 店铺管理</el-breadcrumb-item>
                <el-breadcrumb-item>店铺列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        <el-table
            :data="shopData"
            style="width: 100%"
            border
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
                                    @click="showPickture('店铺照片',props.row.shop_image)" 
                                    >
                                    查看
                                </el-button>
                            </template>
                        </el-form-item>
                        <el-form-item label="店铺背景图">
                             <template scope="scope">
                                <el-button size="small"
                                    @click="showPickture('店铺背景图',props.row.back_image)" 
                                    >
                                    查看
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
                        <el-form-item label="店铺禁闭状态">
                            <span>{{ props.row.encage | encageState }}</span>
                        </el-form-item>
                        <el-form-item label="店铺首页推广">
                            <span>{{ props.row.recommendation | fea }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="店铺ID"
                prop="shop_id"
                sortable>
            </el-table-column>
            <el-table-column
                label="店铺名称"
                prop="shop_name">
            </el-table-column>
            <el-table-column
                label="店铺地址"
                prop="address">
            </el-table-column>
            <el-table-column
                label="过期时间"
                prop="expiration_date">
            </el-table-column>
            <el-table-column
                label="店铺禁闭状态"
                prop="encage">
                <template scope="scope">
                    {{ scope.row.encage | encageState }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary"
                        @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="success"
                        @click="handleEditComm(scope.row)">推广
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="27%">
            <img :src="showImg" alt="">
        </el-dialog>

        <el-dialog title="店铺信息编辑" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="店铺状态" label-width="100px">
                    <el-select v-model="encageState">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="禁闭" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="FormConfirm()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="商品推广状态编辑" :visible.sync="dialogFormVisible1">
            <el-form>
                <el-form-item label="店铺名称">
                    <el-input v-model="form.shop_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="推广状态">
                    <el-radio-group v-model="form.recommendation">
                        <el-radio label="否"></el-radio>
                        <el-radio label="是"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="到期日期">
                    <el-col :span="8">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.expiration_date" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="3">-</el-col>
                    <el-col :span="8">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.expiration_date" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="FormConfirmComm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                shopInfo: '',
                userState: '',
                select_word: '',
                showImg: '',
                title: '',
                dialogVisible: false,
                dialogFormVisible: false,
                dialogFormVisible1: false,
                //  禁闭状态
                encageState: '',
                shopID: '',
                //  推荐状态
                form: ''
            }
        },
        created () {
            this.getData()
        },
        computed: {
            //搜素过滤
            shopData() {
                let search = this.select_word;
                if (search) {
                    return this.shopInfo.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.shopInfo;
            }
        },
        methods: {
            getData() {
                //  获取数据
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetShopList',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.shopInfo = res.data.data
                })
            },
            setShopState(i,s) {
                //  设置店铺状态
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'SetShopEncageState',
                    data: {
                        shop_id: i,
                        state: s
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0 || res.data.error == 10 || res.data.error == 11) {
                        self.$message({
                            message: '设置店铺状态成功',
                            type: 'success'
                        });
                        self.getData()
                    } else {
                        self.$message.error('设置店铺状态失败');
                    }
                })
            },
            setCommState() {
                //  设置推广状态
                let self = this;
                if (self.form.recommendation == '是') {
                    self.form.recommendation = 1
                } else if (self.form.recommendation == '否') {
                    self.form.recommendation = 0
                } 
                this.$axios({
                    method: 'post',
                    url: self.API + 'SetHomeShop',
                    data: {
                        shop_id: self.form.shop_id,
                        expiration_date: self.formateDate(self.form.expiration_date),
                        state: self.form.recommendation
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    if(res.data.error == 0){
                        self.$message({
                                type: 'success',
                                message: '设置成功'
                            });
                        self.getData()
                    }else{
                        self.$message.error('设置失败');
                    }
                })
            },
            showPickture(i,v) {
                //  查看照片
                this.showImg = ''
                this.dialogVisible = true
                this.title = i
                this.showImg = v
            },
            handleEdit(i) {
                //  编辑
                let en = i.encage
                this.shopID = i.shop_id
                this.encageState = en == 1 ? '正常' : '禁闭'
                this.dialogFormVisible = true
            },
            FormConfirm() {
                //  确认编辑
                if (this.encageState == 1 || this.encageState == 0) {
                    this.setShopState(this.shopID,this.encageState)
                }
                this.dialogFormVisible = false
            },
            handleEditComm(v) {
                //  推广
                this.dialogFormVisible1 = true
                this.form = v
                this.form.recommendation = v.recommendation == 1 ? '是' : '否'
            },
            FormConfirmComm() {
                //  确认推广
                this.dialogFormVisible1 = false
                this.setCommState()
            },
            formateDate(i) {
                //  格式化时间
                let d = new Date(i)

                function tt(v) { 
                    if (v < 10 ) {
                        v = "0"+v
                    }
                    return v
                }
                return d.getFullYear()
                    + "-" + tt((d.getMonth()+1))
                    + "-" + tt(d.getDate())
                    + " " + tt(d.getHours())
                    + ":" + tt(d.getMinutes())
                    + ":" + tt(d.getSeconds())
            }
        },
        filters: {
            shopState(v) {
                return v == 1 ? '营业' : '关闭'
            },
            encageState(v) {
                return v == 1 ? '正常' : '禁闭' 
            },
            fea(v) {
                return v == 0 ? '否' : '是'
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