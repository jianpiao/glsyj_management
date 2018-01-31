<template>
    <div class="table">
        <el-table
        v-show="!editForm"
            :data="userInfo"
            style="width: 100%">
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
                prop="admin_id">
            </el-table-column>
            <el-table-column
                label="管理员账户号"
                prop="admin_name">
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
                    >
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="editUser(scope.$index)"
                        type="text"
                        size="small">
                        编辑
                    </el-button>
                    <el-button
                        @click.native.prevent="deleteUser(scope.$index)"
                        type="text"
                        size="small">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-form ref="form" :model="form" label-width="80px" v-show="editForm">
            <el-form-item label="活动名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
                <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="即时配送">
                <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>
            <el-form-item label="活动性质">
                <el-checkbox-group v-model="form.type">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
                <el-radio-group v-model="form.resource">
                <el-radio label="线上品牌商赞助"></el-radio>
                <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userInfo: [],
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        editForm: false
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      var self = this;
      this.$axios
            .get(
            "https://commerce.hh-sky.com/public/index.php/shopping/Admin/GetAdminList"
            )
            .then(res => {
                console.log(res.data.data);
                self.userInfo = res.data.data;
            })
                .catch(err => {
                console.log(err);
        });
    },
    editUser(i) {
        this.editForm = !this.editForm
    },
    deleteUser(i) {
        let self = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                self.userInfo.splice(i,1)
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
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
</style>