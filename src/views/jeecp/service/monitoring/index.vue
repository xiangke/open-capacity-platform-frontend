<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form :inline="true" size="mini" style="margin-bottom: -18px;">
        <el-form-item label prop="username">
          <el-input
            @keyup.enter.native="handleFilter"
            style="width: 200px;"
            placeholder="请输入查询内容"
            v-model="listQuery.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label prop="username">
          <el-select v-model="listQuery.status" placeholder="请选择状态">
            <el-option
              v-for="item in status"
              :key="item.id"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus">新 增</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="服务名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.serviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务地址">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.serviceAddr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方式">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.serviceMethod | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求参数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.serviceParams | timefilters}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            :class="scope.row.state == 200? 'cn':'on'"
          >{{ scope.row.state | statusFilters }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">历史记录</el-button> -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            icon="el-icon-delete"
          ></el-button>
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
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin: -10px;"
      ></el-pagination>
    </template>
    <!-- 新增菜单弹框 -->
    <el-dialog title="新增/编辑菜单" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="服务名称" prop="serviceName">
          <el-input v-model="form.serviceName"></el-input>
        </el-form-item>
        <el-form-item label="服务地址" prop="serviceAddr">
          <el-input v-model="form.serviceAddr"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="serviceMethod">
          <el-select v-model="form.serviceMethod" placeholder="请选择请求方式">
            <el-option v-for="item in sexs" :key="item.id" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求参数" prop="serviceParams">
          <el-input v-model="form.serviceParams" placeholder="请输入请求参数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="submit('form')" v-if="bool" icon="el-icon-check">确 定</el-button>
        <el-button type="primary" @click="upda('form')" v-else icon="el-icon-check">修改</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      sum: null,
      list: null,
      dialogFormVisible: false,
      treeData: [],
      bool: false,
      sexs: [
        {
          id: 0,
          label: "GET",
        },
        {
          id: 1,
          label: "POST",
        },
      ],
      status: [
        {
          id: 0,
          label: "正常",
        },
        {
          id: 1,
          label: "异常",
        },
        {
          id: 2,
          label: "全部",
        },
      ],
      listQuery: {
        page: 1,
        limit: 10,
        username: null,
        status: null,
      },
      total: null,
      form: {
        serviceName: null,
        serviceAddr: null,
        serviceMethod: null,
        serviceParams: null,
        serviceId: null,
      },
      rules: {
        serviceName: [
          {
            required: true,
            message: "请输入服务名称",
            trigger: "blur",
          },
          {
            min: 4,
            max: 10,
            message: "长度在 4 到 10 个字符",
            trigger: "blur",
          },
        ],
        serviceAddr: [
          {
            required: false,
            message: "请输入服务地址",
            trigger: "blur",
          },
          {
            min: 6,
            max: 60,
            message: "长度在 6 到 60 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              const reg = /(http|https):\/\/([^/:]+)(:\d*)?([^# ]*)/;
              if (!reg.test(value)) {
                callback(new Error("输入正确的服务地址"));
              } else {
                callback();
              }
            },
          },
        ],
        serviceMethod: [
          {
            required: true,
            message: "请选择请求方式",
            trigger: "blur",
          },
        ],
      },
      tableKey: 0,
    };
  },
  filters: {
    timefilters(val) {
      if (val == null || val == "" || val == "undefined") {
        return "—";
      } else {
        return val;
      }
    },
    statusFilter(status) {
      const statusMap = {
        0: "GET",
        1: "POST",
        POST: "POST",
        GET: "GET",
      };
      return statusMap[status];
    },
    statusFilters(val) {
      if (val == 200) {
        return "正常";
      } else {
        return "异常";
      }
    },
  },
  created() {
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleFilter() {
      this.sum = null;
      if (this.listQuery.status == "正常") {
        this.sum = 200;
      } else if (this.listQuery.status == "异常") {
        this.sum = 0;
      } else {
        this.sum = null;
      }
      console.log(this.listQuery.username);
      // console.log(sum)

      if (this.listQuery.username == null && this.sum == null) {
        axios
          .post(
            "https://saas.jecinfo.com/gateway/api-monitor/monitor/queryMonitorInfo"
          )
          .then((res) => {
            this.list = res.data.data;
            // console.log(res)
          });
      } else if (this.listQuery.username == null) {
        axios
          .post(
            "https://saas.jecinfo.com/gateway/api-monitor/monitor/queryMonitorInfo?state=" +
              this.sum
          )
          .then((res) => {
            this.list = res.data.data;
            console.log(res);
          });
      } else if (this.sum == null) {
        axios
          .post(
            "https://saas.jecinfo.com/gateway/api-monitor/monitor/queryMonitorInfo?serviceName=" +
              this.listQuery.username
          )
          .then((res) => {
            this.list = res.data.data;
            console.log(res);
          });
      } else {
        axios
          .post(
            "https://saas.jecinfo.com/gateway/api-monitor/monitor/queryMonitorInfo?serviceName=" +
              this.listQuery.username +
              "&state=" +
              this.sum
          )
          .then((res) => {
            this.list = res.data.data;
            console.log(res);
          });
      }
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.bool = false;
      this.form.serviceName = row.serviceName;
      this.form.serviceAddr = row.serviceAddr;
      this.form.serviceMethod = row.serviceMethod;
      this.form.serviceParams = row.serviceParams;
      this.form.serviceId = row.serviceId;
    },
    upda(formName) {
      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          axios
            .post(
              "https://saas.jecinfo.com/gateway/api-monitor/monitor/updateMonitorInfo?serviceId=" +
                this.form.serviceId +
                "&serviceName=" +
                this.form.serviceName +
                "&serviceAddr=" +
                this.form.serviceAddr +
                "&serviceMethod=" +
                this.form.serviceMethod +
                "&serviceParams=" +
                this.form.serviceParams
            )
            .then((res) => {
              this.getList();
              console.log(res);
            })
            .finally(() => {
              this.dialogFormVisible = false;
            });
        } else {
          return false;
        }
      });
    }, 
    handleDelete(index, row) {
      axios
        .post(
          "https://saas.jecinfo.com/gateway/api-monitor/monitor/deleteMonitorInfo?serviceId=" +
            row.serviceId
        )
        .then((res) => {
          this.getList();
        });
    },
    getList() { 
      // getqueryMonitorInfo().then(res => {
      //   console.log(res)
      // })
      axios
        .post(
          "https://saas.jecinfo.com/gateway/api-monitor/monitor/queryMonitorInfo"
        )
        .then((res) => {
          console.log(res)
          // if (res.resp_code === 0) {
            this.list = res.data.data;
            this.total = res.data.data.length;
          // }
        });
    },
    // 新增菜单
    handleAdd() {
      this.dialogFormVisible = true;
      this.bool = true;
      this.form = {};
    },
    onCancel() {
      this.dialogFormVisible = false;
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      axios
        .post(
          "https://saas.jecinfo.com/gateway/api-monitor/monitor/queryMonitorInfo?page=" +
            this.listQuery.page +
            "&size=" +
            this.listQuery.limit
        )
        .then((res) => {
          this.list = res.data.datas;
        });
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      axios
        .post(
          "https://saas.jecinfo.com/gateway/api-monitor/monitor/queryMonitorInfo?page=" +
            this.listQuery.page +
            "&size=" +
            this.listQuery.limit
        )
        .then((res) => {
          this.list = res.data.datas;
        });
    },
    submit(formName) {
      if (this.form.serviceParams == undefined) {
        this.form.serviceParams = "";
      }
      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          axios
            .post(
              "https://saas.jecinfo.com/gateway/api-monitor/monitor/saveMonitorInfo?serviceName=" +
                this.form.serviceName +
                "&serviceAddr=" +
                this.form.serviceAddr +
                "&serviceMethod=" +
                this.form.serviceMethod +
                "&serviceParams=" +
                this.form.serviceParams
            )
            .then((res) => {
              this.getList();
              console.log(res);
            })
            .finally(() => {
              this.dialogFormVisible = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
.on {
  color: red;
}
.cn {
  color: green;
}
</style>