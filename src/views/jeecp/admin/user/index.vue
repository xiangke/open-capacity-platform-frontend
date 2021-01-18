<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form
        :inline="true"
        :model="listQuery"
        size="mini"
        style="margin-bottom: -18px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            @keyup.enter.native="handleFilter"
            style="width: 200px"
            placeholder="用户名"
            v-model="listQuery.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search"
            >搜 索</el-button
          >
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="handleCreate" type="primary" icon="el-icon-plus"
            >新 增</el-button
          >
        </el-form-item>
      </el-form>
    </template>
    <!-- table表格 -->
    <el-table
      :key="tableKey"
      :data="list"
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      highlight-current-row
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="user_head_imgurl"
        align="center"
        label="用户头像"
        width="120"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.headImgUrl"
            :src="scope.row.headImgUrl"
            class="layui-badge layui-bg-gray"
          />
          <img
            v-else
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595998756528&di=221419c69205665a3ff34239d72146b8&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F69%2F80%2F595f67bf2026f_610.jpg"
            class="layui-badge layui-bg-gray"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>
            <img
              v-if="scope.row.avatar"
              class="user-avatar"
              style="width: 20px; height: 20px; border-radius: 50%"
              :src="scope.row.avatar + '?imageView2/1/w/20/h/20'"
            />
            {{ scope.row.username }}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.deptName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sex | statusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="scope.row.enabled"
            @change="change(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleReset(scope.row)"
            >重置密码</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)"
            icon="el-icon-edit"
          ></el-button>
          <!--<el-button size="mini" type="danger" @click="deletes(scope.row)" icon="el-icon-delete"></el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin: -10px"
      ></el-pagination>
    </template>
    <!-- 新增用户弹框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="80%"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输用户名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="dialogStatus == 'create'"
              label="密码"
              placeholder="请输入密码"
              prop="password"
            >
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="验证码登录使用"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input
                v-model="form.nickname"
                placeholder="请输入用户昵称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入用户邮箱"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <el-cascader
                v-model="form.deptId"
                :options="dmaTree"
                :props="{
                  value: 'id',
                  label: 'deptName',
                }"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属角色" prop="roleId">
              <el-select
                v-model="form.roleId"
                multiple
                placeholder="请选择角色"
              >
                <el-option
                  v-for="item in roleData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="bool">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="item in sexs"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close"
          >取 消</el-button
        >
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="create('form')"
          icon="el-icon-check"
          >确 定</el-button
        >
        <el-button
          v-else
          type="primary"
          @click="update('form')"
          icon="el-icon-check"
          >修 改</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  updateEnabled,
  sendReset,
} from "@/api/user";
import { getdeptList } from "@/api/department";

import { fetchAllList } from "@/api/role";
import { validateEMail } from "@/libs/validate";
import ElOption from "element-ui/packages/select/src/option";
export default {
  components: {
    ElOption,
  },
  name: "table_user",
  data() {
    return {
      roleData: {},
      checkedKeys: [],
      sexs: [
        {
          id: 0,
          label: "男",
        },
        {
          id: 1,
          label: "女",
        },
      ],
      dmaTree: [],
      deptId: "",
      defaultProps: {
        children: "children",
        label: "name",
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
      },
      form: {
        username: undefined,
        password: undefined,
        enabled: undefined,
        phone: undefined,
        label: undefined,
        sex: undefined,
        deptId: 2,
      },
      bool: true,
      rules: {
        username: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const reg = /^[a-zA-Z0-9]+$/;
              if (!reg.test(value)) {
                callback(new Error("只能包含英文和数字"));
              } else {
                callback();
              }
            },
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        deptId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur",
          },
        ],
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 6,
            message: "长度在 3 到 6 个字符",
            trigger: "blur",
          },
        ],
        roleId: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "手机号",
            trigger: "blur",
          },
          {
            min: 11,
            max: 11,
            message: "长度在11 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "邮箱",
            trigger: "blur",
          },
          {
            validator: validateEMail,
            trigger: "blur",
          },
        ],
      },
      statusOptions: ["true", "false"],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: "",
      textMap: {
        update: "编辑用户",
        create: "新增用户",
      },
      isDisabled: {
        0: false,
        1: true,
      },
      tableKey: 0,
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "男",
        1: "女",
      };
      return statusMap[status];
    },
  },
  created() {
    this.getList();
    getdeptList().then((res) => {
      console.log(res)
      this.dmaTree = this.getTreeData(res.data.children);
    });
  },
  methods: {
    handleChange() {
      // let deptId = this.form.deptId[1];
      console.log(this.form.deptId);
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery)
        .then((response) => {
          this.list = response.data.data;
          this.total = response.data.count;
          console.log(response.data);
        })
        .finally(() => {
          this.listLoading = false;
        });
      fetchAllList()
        .then((response) => {
          this.roleData = response.data.data;
          console.log(response.data.data);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleReset(val) {
      console.log(val.id);
      sendReset(val.id).then((res) => {
        if (res.status === 200) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "重置成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCreate() {
      this.bool = true;
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      // this.deptId = null;
    },
    handleDept() {
      fetchAllList().then((response) => {
        this.roleData = response.data;
        console.log(response.data);
      });
    },
    handleUpdate: function (row) {
      this.bool = false;
      getObj(row.id).then((response) => {
        var rolelist = [];
        this.form = response.data;
        for (var i = 0; i < response.data.roles.length; i++) {
          rolelist.push(response.data.roles[i].id);
        }
        this.form.enabled = this.statusVal(this.form.enabled);
        this.form.roleId = rolelist;
        this.form.deptId = undefined;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    change(row) {
      updateEnabled(row.id, row.enabled).then(({ data }) => {
        if (data.resp_code === 0) {
          this.getList();
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    statusVal(status) {
      if (status === true) {
        return "有效";
      } else if (status === false) {
        return "无效";
      } else {
        return "";
      }
    },
    create(formName) {
      let obj = {
        deptId: this.form.deptId[1],
        email: this.form.email,
        enabled: "",
        nickname: this.form.nickname,
        password: this.form.password,
        phone: this.form.phone,
        roleId: this.form.roleId,
        sex: this.form.sex,
        username: this.form.username,
      };
      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          addObj(obj)
            .then(({ data }) => {
              if (data.resp_code === 0) {
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000,
                });
              }
            })
            .finally(() => {
              this.dialogFormVisible = false;
            });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      let obj = {
        deptId: this.form.deptId[1],
        email: this.form.email,
        enabled: "",
        id: this.form.id,
        nickname: this.form.nickname,
        password: this.form.password,
        phone: this.form.phone,
        roleId: this.form.roleId,
        sex: this.form.sex,
        username: this.form.username,
      };
      set[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          this.form.enabled = undefined;
          putObj(obj)
            .then(({ data }) => {
              if (data.resp_code === 0) {
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000,
                });
              }
            })
            .finally(() => {
              this.dialogFormVisible = false;
            });
        } else {
          return false;
        }
      });
    },
    deletes(row) {
      this.$confirm(
        "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        delObj(row.userId)
          .then(({ data }) => {
            if (data.resp_code === 0) {
              this.getList();
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
            }
          })
          .finally(() => {
            this.dialogFormVisible = false;
          });
      });
    },
    resetTemp() {
      this.form = {
        id: undefined,
        username: "",
        password: "",
        enabled: "",
        phone: "",
      };
    },
  },
};
</script>

<style>
.layui-badge {
  width: auto;
  height: 60px;
}
</style>
