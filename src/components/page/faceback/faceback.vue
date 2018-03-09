/** 
    投诉管理
    投诉列表
**/
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 投诉管理</el-breadcrumb-item>
                <el-breadcrumb-item>投诉列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-select v-model="facebackSelect" placeholder="筛选" class="handle-select mr10" @change="fackChange(facebackSelect)">
                <el-option key="0" label="已处理" value="0"></el-option>
                <el-option key="1" label="未处理" value="1"></el-option>
            </el-select>
            <el-button>数量 {{ facebaclData.length }}</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        
        <el-table
            :data="facebaclData"
            style="width: 100%"
            border
            :default-sort = "{prop: 'shop_id', order: 'descending'}">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="投诉ID">
                        <span>{{ props.row.complaint_id }}</span>
                    </el-form-item>
                    <el-form-item label="店铺id">
                        <span>{{ props.row.shop_id }}</span>
                    </el-form-item>
                    <el-form-item label="店铺名称">
                        <span>{{ props.row.shop_name }}</span>
                    </el-form-item>
                    <el-form-item label="投诉用户ID">
                        <span>{{ props.row.user_id  }}</span>
                    </el-form-item>
                    <el-form-item label="订单ID">
                        <span>{{ props.row.order_id }}</span>
                    </el-form-item>
                    <el-form-item label="订单号">
                        <span>{{ props.row.order_number }}</span>
                    </el-form-item>
                    <el-form-item label="投诉类型ID">
                        <span>{{ props.row.complaint_type_id }}</span>
                    </el-form-item>
                    <el-form-item label="投诉类型名称">
                        <span>{{ props.row.complaint_type_name }}</span>
                    </el-form-item>
                    <el-form-item label="投诉者昵称">
                        <span>{{ props.row.name}}</span>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <span>{{ props.row.phone_number}}</span>
                    </el-form-item>
                    <el-form-item label="投诉内容">
                        <span>{{ props.row.content }}</span>
                    </el-form-item>
                    <el-form-item label="投诉状态">
                        <span>{{ props.row.state | sta }}</span>
                    </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
                label="投诉ID"
                prop="complaint_id"
                width="100"
                sortable>
            </el-table-column>
            <el-table-column
                label="店铺名称"
                prop="shop_name">
            </el-table-column>
            <el-table-column
                label="投诉类型"
                prop="complaint_type_name">
            </el-table-column>
            <el-table-column
                label="投诉者昵称"
                prop="name">
            </el-table-column>
            <el-table-column
                label="电话号码"
                prop="phone_number">
            </el-table-column>
            <el-table-column
                label="投诉内容"
                prop="content">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary"
                        @click="handleEdit(scope.row,scope.$index)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="处理状态" label-width="100px">
                    <el-select v-model="facebackState">
                        <el-option label="已处理" value="0"></el-option>
                        <el-option label="未处理" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleConfirm()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                facebackInfo: '',
                select_word: '',
                dialogFormVisible: false,
                facebackState: '',
                comIndex: '',
                facebackSelect: '未处理'
            }
        },
        created () {
            this.getData(1)
        },
        computed: {
            //搜素过滤
            facebaclData() {
                let search = this.select_word;
                if (search) {
                    return this.facebackInfo.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.facebackInfo;
            }
        },
        methods: {
            getData(i) {
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetComplaintList',
                    data: {
                        type: i
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.facebackInfo = res.data.data
                })
            },
            setState(i) {
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'SetComplaint',
                    data: {
                        complaint_id: self.facebackInfo[self.comIndex].complaint_id,
                        state: i
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0) {
                        self.$message({
                            message: '商品状态设置成功',
                            type: 'success'
                        });
                        self.getData(1)
                    } else {
                        self.$message.error("处理失败")
                    }
                })
            },
            fackChange(i) {
                //  筛选
                this.getData(i)
            },
            handleConfirm() {
                //  弹出框确认
                if (this.facebackState == 0 || this.facebackState == 1 && this.facebackState != this.facebackInfo[this.comIndex].state) {
                    this.setState(this.facebackState)
                }
                this.dialogFormVisible = false
            },
            handleEdit(v,i) {
                //  编辑
                this.comIndex = i
                this.facebackState = v.state == 0 ? '已处理' : '未处理'
                this.dialogFormVisible = true
            }
        },
        filters: {
            sta(v) {
                return v == 0 ? '已处理' : '未处理'
            }
        }
    }
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
