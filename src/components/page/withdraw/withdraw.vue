/** 
    取款审核
    审核列表
**/
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 取款审核</el-breadcrumb-item>
                <el-breadcrumb-item>审核列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 头部搜索 -->
        <div class="handle-box">
            <el-select v-model="selectType" placeholder="全部" class="handle-select mr10" @change="select(selectType)">
                <el-option label="全部" value="0"></el-option>
                <el-option label="待审核" value="1"></el-option>
                <el-option label="审核通过" value="2"></el-option>
                <el-option label="审核失败" value="3"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        <!-- 数据列表 -->
        <el-table :data="shopData" border style="width: 100%;">
            <el-table-column prop="shop_id" label="店铺ID" sortable>
            </el-table-column>
            <el-table-column prop="shop_name" label="店铺名称" width="100">
            </el-table-column>
            <el-table-column prop="address" label="店铺地址" width="200">
            </el-table-column>
            <el-table-column prop="real_name" label="提款者" width="80">
            </el-table-column>
            <el-table-column prop="money" label="提款金额" sortable>
                 <template scope="scope">
                    {{ scope.row.money /100 | getFloatStr }}
                </template>
            </el-table-column>
            <el-table-column prop="state" label="提款状态" width="90">
                <template scope="scope">
                    {{ scope.row.state | sta}}
                </template>
            </el-table-column>
            <el-table-column prop="creation_time" label="提款时间" width="180" sortable>
            </el-table-column>
            <el-table-column prop="up_time" label="消息处理时间" width="180" sortable>
            </el-table-column>
            <el-table-column prop="review_response" label="审核回复">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="primary"
                        @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹框 -->
        <el-dialog title="商铺提现审核" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="提款号">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="提款审核">
                    <el-radio-group v-model="form.state">
                        <el-radio label="通过审核"></el-radio>
                        <el-radio label="否决审核"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.review"></el-input>
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
                withdrawList: '',
                selectType: '全部',
                shopIndex: '',
                dialogFormVisible: false,
                form: {
                    id: '',
                    state: '',
                    password: '',
                    review: ''
                },
                select_word: ''
            }
        },
        created () {
            this.getData(0)
        },
        computed: {
            //搜素过滤
            shopData() {
                let search = this.select_word;
                if (search) {
                    return this.withdrawList.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.withdrawList;
            }
        },
        methods: {
            getData(i) {
                //  获取信息
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetWithdrawList',
                    data: {
                        state: i
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.withdrawList = res.data.data
                })
            },
            select(v) {
                this.getData(v)
            },
            setCommState() {
                //  提交信息
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'ExamineWithdraw',
                    data: {
                        withdrawals_id: self.form.id,
                        examine_state: self.form.state == '通过审核' ? 1 : 0,
                        admin_pass: self.form.password,
                        review_response: self.form.review
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.form.password = ''
                    self.form.review = ''
                    self.form.state = ''
                    //  刷新数据
                    self.getData(self.selectType)
                    if(res.data.error == 0){
                        self.$message({
                                type: 'success',
                                message: '设置成功'
                            });
                    }else{
                        self.$message.error(res.data.data);
                    }
                })
            },
            handleEdit(i,v) {
                //  编辑
                let self = this
                this.dialogFormVisible = true
                this.form.id = v.withdrawals_id
                if (v.state == 1 || v.state == 3) {
                    self.form.state = '否决审核'
                } else {
                    self.form.state = '通过审核'
                }
                this.shopIndex = i
            },
            FormConfirm() {
                //  确认提交修改信息
                if (this.form.password != '') {
                    this.setCommState()
                    this.dialogFormVisible = false
                } else {
                    this.$message.error('密码不能为空');
                }
            }
        },
        filters: {
            sta(v) {
                if (v == 1) {
                    return '待审核'
                } else if (v == 2) {
                    return '取款成功'
                } else if (v == 3) {
                    return '审核失败'
                }
            },
            getFloatStr(num) {
                num += '';
                num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符  
                if (/^0+/) //清除字符串开头的0  
                    num = num.replace(/^0+/, '');
                if (!/\./.test(num)) //为整数字符串在末尾添加.00  
                    num += '.00';
                if (/^\./.test(num)) //字符以.开头时,在开头添加0  
                    num = '0' + num;
                num += '00';        //在字符串末尾补零  
                num = num.match(/\d+\.\d{2}/)[0];
                return num
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