/** 
    管理员管理
    管理员列表
**/
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 管理员管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        <el-table
            :data="userData"
            style="width: 100%"
            border
            :default-sort = "{prop: 'admin_id', order: 'descending'}">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="管理员账号ID">
                            <span>{{ props.row.admin_id }}</span>
                        </el-form-item>
                        <el-form-item label="真实姓名">
                            <span>{{ props.row.real_name }}</span>
                        </el-form-item>
                        <el-form-item label="管理员账户号">
                            <span>{{ props.row.admin_name }}</span>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <span>{{ props.row.phone_number }}</span>
                        </el-form-item>
                        <el-form-item label="权限">
                            <span v-for="item in props.row.authority">{{ item | au}}</span>
                        </el-form-item>
                        <el-form-item label="身份证号">
                            <span>{{ props.row.id_card }}</span>
                        </el-form-item>
                        <el-form-item label="账号状态">
                            <span>{{ props.row.account_state | accountState }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="管理员账号ID"
                prop="admin_id"
                sortable>
            </el-table-column>
            <el-table-column
                label="管理员账户号"
                prop="admin_name">
            </el-table-column>
            <el-table-column
                label="帐号状态"
                prop="account_state">
                <template scope="scope">
                    {{ scope.row.account_state | accountState }}
                </template>
            </el-table-column>
            <el-table-column
                label="真实姓名"
                prop="real_name">
            </el-table-column>
            <el-table-column
                label="手机号码"
                prop="phone_number">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="210"
                    >
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="editUser(scope.$index),prop"
                        type="primary"
                        size="small">
                        编辑
                    </el-button>
                    <el-button
                        @click.native.prevent="deleteUser(scope.$index)"
                        type="danger"
                        size="small">
                        删除
                    </el-button>
                    <el-button
                        @click.native.prevent="modifyPassword(scope.row.admin_id)"
                        type="success"
                        size="small">
                        密码
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="编辑管理员信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="管理员账户号" :label-width="formLabelWidth">
                <el-input v-model="managerAccountName" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="真实名字" :label-width="formLabelWidth">
                <el-input v-model="realName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" :label-width="formLabelWidth">
                <el-input v-model="userPhone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限" :label-width="formLabelWidth">
                <el-select v-model="value10" multiple filterable allow-create default-first-option
                        placeholder="请选择权限">
                    <el-option
                        v-for="item in options5"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号状态" :label-width="formLabelWidth">
                <el-select v-model="accountState">
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="封闭" value="0"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="FormConfirm()">确 定</el-button>
        </div>
        </el-dialog>

        <el-dialog title="管理员密码更改" :visible.sync="dialogPassword">
        <el-form>
            <el-form-item label="新密码" label-width="100px">
                <el-input v-model="newPassword" auto-complete="off" placeholder="以字母开头，长度在6~18之间，只能包含字母、数字和下划线"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogPassword = false">取 消</el-button>
            <el-button type="primary" @click="PassConfirm()">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            //  保存请求的用户全部信息
            userInfo: [],
            select_word: '',
            //  管理员账号名
            managerAccountName: '',
            realName: '',
            userPhone: '',
            //  编辑表格显示状态为影藏
            dialogFormVisible: false,
            dialogPassword: false,
            newPassword: '',
            //  编辑表格内容
            form: {
                name: "",
                region: "",
                date1: "",
                date2: ""
            },
            //  编辑表格宽度
            formLabelWidth: "120px",
            //  权限选项
            options5: [{
                    value: '1',
                    label: '管理员管理'
                }, {
                    value: '2',
                    label: '用户管理'
                }, {
                    value: '3',
                    label: '店铺管理'
                },
                {
                    value: '4',
                    label: '商品审核'
                },
                {
                    value: '5',
                    label: '投诉管理'
                }],
                value10: [],
                //  帐号状态
                accountState: '',
                //  储存用户id
                userID: '',
                //  数组标记序号
                numID: '',
                dialog: false
        };
    },
    created() {
        //进入页面获取列表信息
        this.getUserData();
    },
    computed: {
            //搜素过滤
            userData() {
                let search = this.select_word;
                if (search) {
                    return this.userInfo.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.userInfo;
            }
        },
    methods: {
        getUserData() {
            let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetAdminList',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then(function (res) {
                    console.log(res.data.data);
                    self.userInfo = res.data.data
                }).catch(function (error) {
                    console.log(error);
                });
            },
            deleteUser(i) {
                let self = this;
                this.$confirm("是否确认删除管理员账户", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    self.userInfo.splice(i, 1);
                    this.$message({
                    type: "success",
                    message: "删除成功!"
                    });
                })
            },
            //  显示编辑信息
            editUser(i) {
                //  标记id
                this.numID = i
                //  弹框状态
                this.dialogFormVisible = !this.dialogFormVisible
                //  管理员id
                this.userID = this.userInfo[i].admin_id
                //  管理员名字
                this.managerAccountName = this.userInfo[i].admin_name
                //  真实名字
                this.realName = this.userInfo[i].real_name
                //  手机号码
                this.userPhone = this.userInfo[i].phone_number
                //  已经选中的权限
                this.value10 = this.userInfo[i].authority
                //  状态
                this.accountState = this.userInfo[i].account_state == '0' ? '封闭' : '正常'
            },
            //  确认提交编辑信息
            FormConfirm(id,s) {
                let self = this
                //  提交信息
                this.$axios({
                    method: 'post',
                    data: {
                        admin_id: self.userID,
                        real_name: self.realName,
                        phone_number: self.userPhone,
                        account_state: self.accountState,
                        authority_value: JSON.stringify(self.value10)
                    },
                    url: self.API + 'SetAdmin',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                    })
                    .then(res => {
                        console.log(res.data.data);
                        if (res.data.error == 0) {
                            self.$message({
                                message: '信息修改成功',
                                type: 'success'
                            });
                            //  服务器修改成之后修改本地内容
                            self.userInfo[self.numID].real_name = self.realName
                            self.userInfo[self.numID].phone_number = self.userPhone
                            self.userInfo[self.numID].account_state = self.accountState
                            self.userInfo[self.numID].authority = self.value10
                        } else {
                        self.$message.error('状态修改失败');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                //  弹框状态为影藏
                this.dialogFormVisible = false
            },
            //　检查密码
            checkPassword(v) {
                var reg = /^[a-zA-Z]\w{6,17}$/
                return reg.test(v);  
            },
            modifyPassword(i) {
                //  编辑新的密码
                this.newPassword = ''
                this.dialogPassword = true
                this.userID = i
            },
            PassConfirm() {
                //  修改密码
                let self = this
                if (this.checkPassword(this.newPassword)) {
                    //  提交信息
                    this.$axios({
                        method: 'post',
                        url: self.API + 'UpAdminPass',
                        data: {
                            admin_id: self.userID,
                            account_pass: self.newPassword
                        },
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    })
                    .then(res => {
                        if (res.data.error == 0) {
                            self.$message({
                                message: '密码修改成功',
                                type: 'success'
                            });
                        } else {
                            self.$message.error('密码修改失败');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                } else {
                    this.$message.error('密码不符合标准，请重新输入');
                }

                this.dialogPassword = false
            }
        },
        filters: {
            accountState(v) {
                return v == 0 ? "封闭" : "正常";
            },
            au(v) {
                if (v == 1) {
                    return "  管理员管理";
                } else if (v == 2) {
                    return "  用户管理";
                } else if (v == 3) {
                    return "  店铺管理";
                } else if (v == 4) {
                    return "  商品审核";
                } else {
                    return "  投诉管理";
                }
            }
        }
    };
</script>

<style scoped>
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
</style>