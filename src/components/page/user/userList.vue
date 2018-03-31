/** 
    用户管理
    用户列表
**/
<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="userState" placeholder="状态选择" class="handle-select mr10" @change="selectUserState">
                <el-option key="4" label="全部" value="4"></el-option>
                <el-option key="0" label="停用账号" value="0"></el-option>
                <el-option key="1" label="待审核账号" value="1"></el-option>
                <el-option key="2" label="正常用户" value="2"></el-option>
                <el-option key="3" label="审核否决" value="3"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        <el-table :data="userData = userList" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="account_name" label="账号名" sortable width="110">
            </el-table-column>
            <el-table-column prop="real_name" label="真实名字" width="95">
            </el-table-column>
            <el-table-column prop="phone_number" label="手机号" width="130">
            </el-table-column>
            <el-table-column prop="account_state" label="帐号状态" width="110">
                <template scope="scope">
                    {{ scope.row.account_state | accountStateFilter}}
                </template>
            </el-table-column>
            <el-table-column prop="life_photos" label="生活照" width="90">
                <template scope="scope">
                    <el-button size="small"
                        @click="showPhone('生活照',scope.row.life_photos)" 
                        v-show="scope.row.life_photos != '' && scope.row.life_photos != null">
                        查看
                    </el-button>
                    <span v-show="scope.row.life_photos == '' || scope.row.life_photos == null">
                        空
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="id_card_photo_positive" label="身份证正面" width="110">
                <template scope="scope">
                    <el-button size="small"
                        @click="showPhone('身份证正面',scope.row.id_card_photo_positive)"
                        v-show="scope.row.id_card_photo_positive != '' && scope.row.id_card_photo_positive != null">
                        查看
                    </el-button>
                    <span v-show="scope.row.life_photos == '' || scope.row.life_photos == null">
                        空
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="id_card_photo_other" label="身份证反面" width="110">
                <template scope="scope">
                    <el-button size="small"
                        @click="showPhone('身份证正面',scope.row.id_card_photo_other)"
                        v-show="scope.row.id_card_photo_other != '' && scope.row.id_card_photo_other != null">
                        查看
                    </el-button>
                    <span v-show="scope.row.life_photos == '' || scope.row.life_photos == null">
                        空
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="Email">
                <template scope="scope">
                    {{ scope.row.email | emailFilter}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" type="primary"
                        @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="info"
                        @click="handleRelated(scope.row.account_id)">关联
                    </el-button>
                    <el-button size="small"
                        @click="openShop(scope.row)">开店
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="27%">
            <img :src="showImg" alt="">
        </el-dialog>

        <el-dialog title="用户信息编辑(不填写内容即不更改)" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="新密码" label-width="100px">
                    <el-input v-model="newPassword" auto-complete="off" placeholder="以字母开头，长度在6~18之间，只能包含字母、数字和下划线"></el-input>
                </el-form-item>
                <el-form-item label="审核状态" label-width="100px">
                    <el-select v-model="audit" :disabled="auditState">
                        <el-option label="通过" value="1"></el-option>
                        <el-option label="否决" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核备注" label-width="100px">
                    <el-input v-model="remark" auto-complete="off" :disabled="auditState"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="FormConfirm()">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //  接收请求数据
                // userList: '',
                //  关键字
                select_word: '',
                //  用户状态
                userState: '全部',
                //  状态列表储存
                userInfoFilter: '',
                //  图片查看弹框状态
                dialogVisible: false,
                //  弹框的照片
                showImg: '',
                //  弹框的标题
                title: '',
                //  编辑弹框
                dialogFormVisible: false,
                //  审核
                audit: '',
                //  审核状态
                auditState: false,
                //  审核备注
                remark: '',
                //  提交的id（临时）
                submitID: '',
                //  新密码
                newPassword: '',
            }
        },
        created(){
            //  载入页面获取数据
            this.getData(4);
        },
        computed: {
            //搜素过滤
            userList() {
                let search = this.select_word;
                if (search) {
                    return this.userInfoFilter.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.userInfoFilter;
            }
        },
        methods: {
            getData(i){
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetUserList',
                    data: {
                        state: i
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.userInfoFilter = res.data.data
                    self.userList = res.data.data
                })
            },
            setAudit(id,i,r) {
                //  更改审核状态
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'AuditingUser',
                    data: {
                        account_id: id,
                        pass: i,
                        remark: r
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0) {
                        self.$message({
                            message: '审核状态设置成功',
                            type: 'success'
                        });
                    } else {
                        self.$message.error('审核状态设置失败');
                    }
                })
            },
            setPassword(id,i) {
                //  更改新的密码
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'UpUserPass',
                    data: {
                        account_id: id,
                        account_pass: i
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0) {
                        self.$message({
                            message: '密码设置成功',
                            type: 'success'
                        });
                    } else {
                        self.$message.error('密码设置失败');
                    }
                })
            },
            selectUserState(i) {
                //  选择用户列表状态
                let listFilter = this.userInfoFilter
                this.getData(i)
            },
            //  编辑
            handleEdit(index, row) {
                //　获取临时id
                this.submitID = row.account_id
                //  审核状态
                this.auditState = row.account_state == 1 ? false : true
                //  弹框状态
                this.dialogFormVisible = !this.dialogFormVisible
            },
            //  删除
            handleRelated(i) {
                this.$store.dispatch('userID',i)
                this.$router.push('/related')
            },
            //  开店
            openShop(i) {
                this.$store.dispatch('userID',i)
                this.$router.push('/openShop')
            },  
            //  查看照片
            showPhone(t,v) {
                this.showImg = ''
                this.dialogVisible = true
                this.showImg = v
                this.title = t
            },
            cancel() {
                this.dialogFormVisible = false
                this.newPassword = ''
            },
            //  确认弹框
            FormConfirm() {
                //  提交审核状态和审核备注
                if (this.audit != '') {
                    this.setAudit(this.submitID,this.audit,this.remark)
                }
                //  提交更改的密码
                if (this.newPassword != '' && this.checkPassword(this.newPassword)) {
                    this.setPassword(this.submitID,this.newPassword)
                } else {
                    this.$message.error('密码输入有误');
                }
                this.dialogFormVisible = false
                this.newPassword = ''
            },
            //　检查密码
            checkPassword(v) {
                var reg = /^[a-zA-Z]\w{6,17}$/
                return reg.test(v);  
            },
        },
        filters: {
            //  帐号状态过滤
            accountStateFilter(v) {
                if (v == 0) {
                    return '账号被停用'
                } else if (v == 1) {
                    return '待审核'
                } else if (v == 2) {
                    return '正常'
                } else if (v == 3) {
                    return '审核否决'
                }
            },
            email(v) {
                return v == '' ? '空' : v 
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
</style>