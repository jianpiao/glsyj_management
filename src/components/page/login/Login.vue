<template>
    <div class="login-wrap">
        <div class="ms-title">广理商业街后台管理系统</div>
        <div class="ms-login">
            <el-form ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="username" placeholder="管理员帐号" clearable></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="管理员密码" v-model="password" clearable @keyup.enter.native="login"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">提示 : 管理员分别拥有不同的权限</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            login() {
                if (this.username == '' || this.password == '') {
                    this.$message.error('帐号或密码不能为空');
                } else {
                    this.check()
                }
            },
            check() {
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'Login',
                    data: {
                        admin_name: self.username,
                        account_pass: self.password
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then(function (res) {
                    console.log(res)
                    if(res.data.error == 0){
                        self.$message({
                                type: 'success',
                                message: '登录成功'
                            });
                            localStorage.setItem('ms_username',self.username);
                            sessionStorage.setItem("data",res.data.data.session_id)
                            self.$router.push('/readme')
                    }else{
                        self.$message.error('登录失败');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>