/** 
    开店
**/
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
                <el-breadcrumb-item>开店</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户ID">
                <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名称">
                <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="店铺分类">
                <el-select v-model="form.region" placeholder="请选择店铺分类">
                    <el-option :label="item.shop_category_name" :value="item.shop_category_id" v-for="item in shopCategory"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="过期日期">
                <el-col :span="5">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 90%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="1">--</el-col>
                <el-col :span="5">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 90%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="校区选择">
                <el-select v-model="form.school" placeholder="请选择校区" @change="chang(form.school)">
                    <el-option :label="item.address_name" :value="item.select_id" v-for="item in address"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="楼宇选择">
                <el-select v-model="form.building" placeholder="请选择楼宇">
                    <el-option :label="item.address_name" :value="item.select_id" v-for="item in address[schoolIndex].after"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="楼层选择">
                <el-select v-model="form.floor" placeholder="请选择楼层">
                    <el-option :label="item+'楼'" :value="item" v-for="item in floor"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="精确地址">
                <el-input v-model="form.address" placeholder="精确店铺地址（如东“区生活区A16卡”）"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确认</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
    export default {
        data() {
            return {
            form: {
                    id: this.$store.getters.userID.account_id,
                    name: this.$store.getters.userID.account_name,
                    region: '',
                    date1: '',
                    date2: '',
                    school: '',
                    building: '',
                    floor: '',
                    address: ''
                },
                shopCategory: '',
                address: '',
                schoolIndex: 0,
                floor: [1,2,3,4,5]
            }
        },
        created () {
            this.getData()  
        },
        methods: {
            getData() {
                let self = this;
                //  分类
                this.$axios({
                    method: 'post',
                    url: self.API + 'ShopCategoryList',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.shopCategory = res.data.data
                })

                //  地址
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetSelectAddress',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.address = res.data.data
                })
            },
            //  选择校区才可以选择卡位
            chang(i) {
                this.schoolIndex = i - 1
            },
            onSubmit() {
                //  提交申请
                let self = this
                this.$axios({
                    method: 'post',
                    url: self.API + 'OpenShop',
                    data: {
                        account_id: self.form.id,
                        shop_category: self.form.region,
                        expiration_date: this.formateDate(self.form.date1,self.form.date2),
                        campus: self.form.school,
                        building: self.form.building,
                        layers: self.form.floor,
                        address: self.form.address
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0) {
                        self.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                    } else {
                        self.$message.error("提交失败")
                    }
                })
            },
            formateDate(d,t) {
                let dd = new Date(d);
                let ti = new Date(t)

                function tt(v) { 
                    if (v < 10 ) {
                        v = "0"+v
                    }
                    return v
                }
                return dd.getFullYear()
                    + "-" + tt((dd.getMonth()+1))
                    + "-" + tt(dd.getDate())
                    + " " + tt(ti.getHours())
                    + ":" + tt(ti.getMinutes())
                    + ":" + tt(ti.getSeconds())
            },
            back() {
                this.$router.back(-1)
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
