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
                        type="primary"
                        size="small">
                        编辑
                    </el-button>
                    <el-button
                        @click.native.prevent="deleteUser(scope.$index)"
                        type="danger"
                        size="small">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
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