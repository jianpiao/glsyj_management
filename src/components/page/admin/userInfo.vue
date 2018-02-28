<template>
    <div class="table">
        <el-table
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
                        @click.native.prevent="editUser(scope.$index),prop"
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
        <el-dialog title="编辑管理员信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="管理员账户号" :label-width="formLabelWidth">
                <el-input v-model="managerAccountName" auto-complete="off"></el-input>
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
            <el-button @click="FormCancel">取 消</el-button>
            <el-button type="primary" @click="FormConfirm()">确 定</el-button>
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
          //  管理员账号名
          managerAccountName: '',
          realName: '',
          userPhone: '',
          //  编辑表格显示状态为影藏
          dialogFormVisible: false,
          //  编辑表格内容
          form: {
              name: "",
              region: "",
              date1: "",
              date2: "",
              delivery: false,
              type: [],
              resource: "",
              desc: ""
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
            userID: ''
      };
  },
  created() {
      //进入页面获取列表信息
      this.getUserData();
  },
  methods: {
      getUserData() {
        var self = this;
        this.$axios
          .get(
            self.API + "GetAdminList"
          )
          .then(res => {
            console.log(res.data.data);
            self.userInfo = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      },
      deleteUser(i) {
        let self = this;
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
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
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //  显示编辑信息
      editUser(i) {
          this.dialogFormVisible = !this.dialogFormVisible
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
      //  取消编辑信息
      FormCancel() {
              this.dialogFormVisible = false
              this.$message({
              message: '取消',
              type: 'warning'
          });
      },  
      //  确认提交编辑信息
      FormConfirm(id,s) {
        let self = this
        let PostState = 0
        //  提交状态
        this.$axios
            .post(
                self.API + "SetAdmin",
                {
                  admin_id: self.userID,
                  real_name: self.realName,
                  phone_number: self.userPhone,
                  account_state: self.accountState == '封闭' ? 0 : 1
                }
            )
            .then(res => {
                console.log(res.data.data);
                if (res.data.data == 0) {
                      self.$message({
                        message: '状态修改成功',
                        type: 'success'
                    });
                } else {
                  self.$message.error('状态修改失败');
                }
            })
            .catch(err => {
                  console.log(err);
            });

            //  提交权限
            this.$axios
            .post(
                self.API + "SetAdminAuthority",
                {
                  admin_id: self.userID ,
                  authority_value: JSON.stringify(self.value10)
                }
            )
            .then(res => {
                console.log(res.data.data);
                if (res.data.data == 0) {
                    self.$message({
                        message: '权限修改成功',
                        type: 'success'
                    });
                } else {
                  self.$message.error('权限修改失败');
                }
            })
            .catch(err => {
                  console.log(err);
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