/** 
    店铺管理
    店铺推广
**/
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 店铺管理</el-breadcrumb-item>
                <el-breadcrumb-item>店铺推广</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        <el-table :data="shopData" border style="width: 100%">
            <el-table-column prop="id" label="推广ID" sortable >
            </el-table-column>
            <el-table-column prop="shop_id" label="店铺ID" >
            </el-table-column>
            <el-table-column prop="shop_name" label="店铺名称" >
            </el-table-column>
            <el-table-column prop="expiration_date" label="到期日期" >
            </el-table-column>
            <el-table-column prop="priority" label="优先级">
            </el-table-column>
            <el-table-column prop="state" label="推广状态">
                <template scope="scope">
                    {{ scope.row.state | sta}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" type="primary"
                        @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="商品推广状态编辑" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="店铺名称">
                    <el-input v-model="form.shop_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="推广状态">
                    <el-radio-group v-model="form.state">
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
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="FormConfirm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                recommendList: '',
                shopID: '',
                dialogFormVisible: false,
                form: '',
                select_word: ''
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
                    return this.recommendList.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.recommendList;
            }
        },
        methods: {
            getData() {
                //  获取信息
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetHomeShop',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.recommendList = res.data.data
                })
            },
            setCommState() {
                //  提交信息
                let self = this;
                if (self.form.state == '是') {
                    self.form.state = 1
                } else if (self.form.state == '否') {
                    self.form.state = 0
                } 
                this.$axios({
                    method: 'post',
                    url: self.API + 'SetHomeShop',
                    data: {
                        shop_id: self.form.shop_id,
                        expiration_date: self.formateDate(self.form.expiration_date),
                        priority: self.form.priority,
                        state: self.form.state
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
            handleEdit(i,v) {
                //  编辑
                this.dialogFormVisible = true
                this.form = v
                this.form.state = v.state == 1 ? '是' : '否'
            },
            FormConfirm() {
                //  确认提交推广信息
                this.dialogFormVisible = false
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
            sta(v) {
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