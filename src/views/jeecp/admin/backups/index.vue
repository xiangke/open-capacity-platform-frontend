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
        <el-form-item label="数据源名称" prop="username">
          <el-input
            @keyup.enter.native="handleFilter"
            style="width: 200px"
            placeholder="请输入数据源名称"
            v-model="listQuery.datasourceName"
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
    <el-table :data="list" style="width: 100%">
      <el-table-column align="center" label="数据源名称">
        <template slot-scope="scope">
          <span>
            {{ scope.row.datasourceName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.jdbcUsername }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="密码">
        <template slot-scope="scope">
          <span>{{ scope.row.jdbcPassword }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="jdbcUrl">
        <template slot-scope="scope">
          <span>{{ scope.row.jdbcUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备份周期">
        <template slot-scope="scope">
          <span>{{ scope.row.cronStr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text
            inactive-text
            v-model="scope.row.status"
            @change="change(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            icon="el-icon-delete"
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleDispatch(scope.row)"
            >查看调度结果</el-button
          >
          <!-- <el-button size="mini" type="primary" @click="examine(scope.row)"
            >查看</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 调度结果 -->
    <el-dialog title="调度结果" :visible.sync="dialogFormVisibles" width="80%">
      <el-table :data="lists" style="width: 100%">
        <el-table-column align="center" label="调度时间">
          <template slot-scope="scope">
            <span>
              {{ scope.row.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="调度状态">
          <template slot-scope="scope">
            <span>
              {{ scope.row.status | statuss }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="文件名称">
          <template slot-scope="scope">
            <span>
              {{ scope.row.fileName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="download(scope.row)"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <el-pagination
          background
          @size-change="handleSizeChanges"
          @current-change="handleCurrentChanges"
          :current-page.sync="listQuerys.page"
          :page-sizes="[8, 16, 24, 32]"
          :page-size="listQuerys.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          style="margin: -10px"
        ></el-pagination>
      </template>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="cancels('form')" icon="el-icon-close"
          >取 消</el-button
        >
        <el-button type="primary" @click="create('form')" icon="el-icon-check"
          >确 定</el-button
        >
      </div> -->
    </el-dialog>
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
        <el-form-item label="数据源名称" prop="datasourceName">
          <el-input
            v-model="form.datasourceName"
            placeholder="请输入数据源名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户名称" prop="jdbcUsername">
          <el-input
            v-model="form.jdbcUsername"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" placeholder="请输入密码" prop="jdbcPassword">
          <el-input type="password" v-model="form.jdbcPassword"></el-input>
        </el-form-item>

        <el-form-item label="jdbcUrl" prop="jdbcUrl">
          <el-input
            v-model="form.jdbcUrl"
            placeholder="jdbc:mysql://${host}:${port}/${database}"
          ></el-input>
        </el-form-item>

        <el-form-item label="CRON" prop="cronStr">
          <el-popover v-model="form.cronStr">
            <el-input
              slot="reference"
              @click="cronPopover = true"
              v-model="cron"
              placeholder="请输入定时策略"
              style="width: 40%"
            ></el-input>
            <cron
              @change="changeCron"
              @click="cronPopover = false"
              i18n="cn"
            ></cron>
          </el-popover>
        </el-form-item>
        <el-form-item label="描述" prop="comments">
          <el-input v-model="form.comments" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close"
          >取 消</el-button
        >
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="create('form')"
          :disabled="bools"
          icon="el-icon-check"
          >确 定</el-button
        >
        <el-button
          v-else
          :disabled="bools"
          type="primary"
          @click="update('form')"
          icon="el-icon-check"
          >修 改</el-button
        >
        <el-button type="primary" @click="measurement('form')"
          >测试连接</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import axios from "axios";
import { cron } from "vue-cron";
import {
  queryJobDatasourceList,
  deleteBackupInfo,
  updateStatus,
  saveOrUpdateBackupInfo,
  testJdbcUrl,
  queryHistoryList,
} from "@/api/backups";

export default {
  components: { cron },
  name: "table_user",
  data() {
    return {
      bbbb: 0,
      cronPopover: false,
      cron: "",
      bool: true,
      bools: true,
      list: [],
      lists: [],
      total: null,
      counts: null,
      listQuery: {
        page: 1,
        limit: 10,
        datasourceName: null,
      },
      listQuerys: {
        page: 1,
        limit: 8,
      },
      form: {
        datasourceName: undefined,
        jdbcUsername: undefined,
        jdbcPassword: undefined,
        jdbcUrl: undefined,
        cronStr: undefined,
        comments: undefined,
      },
      rules: {
        datasourceName: [
          {
            required: true,
            message: "请输入数据源名称",
            trigger: "blur",
          },
        ],
        jdbcUsername: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur",
          },
        ],
        jdbcPassword: [
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
        jdbcUrl: [
          {
            required: true,
            message: "请输入jdbcUrl",
            trigger: "blur",
          },
        ],
        cronStr: [
          {
            required: true,
            message: "请输入定时策略",
            trigger: "blur",
          },
        ],
        comments: [
          {
            required: true,
            message: "请输入描述",
            trigger: "blur",
          },
        ],
      },
      dialogFormVisible: false,
      dialogFormVisibles: false,
      dialogStatus: "",
      textMap: {
        update: "编辑信息",
        create: "新增信息",
      },
    };
  },
  filters: {
    statuss(val) {
      if (val == 1) {
        return "失败";
      } else {
        return "成功";
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    changeCron(val) {
      this.cron = val;
    },
    // 获取列表数据
    getList() {
      queryJobDatasourceList(this.listQuery).then((res) => {
        if (res.status == 200) {
          console.log(res.data.data);
          this.list = res.data.data;
          this.total = res.data.count;
        }
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChanges(val) {
      this.listQuerys.limit = val;
      this.handleDispatch();
    },
    handleCurrentChanges(val) {
      this.listQuerys.page = val;
      this.handleDispatch();
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
      this.cron = undefined;
    },
    // 修改
    handleUpdate(row) {
      console.log(row);
      this.dialogStatus = "update";
      this.bool = false;
      this.dialogFormVisible = true;
      (this.form.datasourceName = row.datasourceName),
        (this.form.id = row.id),
        (this.form.jdbcUsername = row.jdbcUsername),
        (this.form.jdbcPassword = row.jdbcPassword),
        (this.form.jdbcUrl = row.jdbcUrl),
        (this.cron = row.cronStr),
        (this.form.jobInfoId = row.jobInfoId),
        (this.form.comments = row.comments);
    },
    //查看数据
    examine() {},
    // 删除数据
    handleDelete(row) {
      let obj = {
        id: row.id,
        jobInfoId: row.jobInfoId,
      };
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteBackupInfo(obj).then((res) => {
          if (res.status == 200) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          }
        });
      });
    },
    // 状态修改
    change(row) {
      let obj = {
        id: row.id,
        status: null,
        jobInfoId: row.jobInfoId,
      };
      if (row.status == false) {
        obj.status = 0;
      } else {
        obj.status = 1;
      }
      updateStatus(obj).then((res) => {
        if (res.status == 200) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        }
      });
    },
    // 连接测试
    measurement(formName) {
      let obj = {
        datasourceName: this.form.datasourceName,
        jdbcUsername: this.form.jdbcUsername,
        jdbcPassword: this.form.jdbcPassword,
        cronStr: this.cron,
        jdbcUrl: this.form.jdbcUrl,
        comments: this.form.comments,
      };
      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          testJdbcUrl(obj).then((res) => {
            if (res.data.resp_code == 0) {
              this.bools = false;
              this.$notify({
                title: "成功",
                message: "连接成功",
                type: "success",
                duration: 2000,
              });
            } else {
              this.bools = true;
              this.$notify.error({
                title: "失败",
                message: res.data.resp_msg,
                type: "success",
                duration: 2000,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 修改数据
    create(formName) {
      let obj = {
        datasourceName: this.form.datasourceName,
        jdbcUsername: this.form.jdbcUsername,
        jdbcPassword: this.form.jdbcPassword,
        cronStr: this.cron,
        jdbcUrl: this.form.jdbcUrl,
        comments: this.form.comments,
      };
      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          saveOrUpdateBackupInfo(obj)
            .then((res) => {
              if (res.status == 200) {
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
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
    handleDispatch(val) {
      this.dialogFormVisibles = true;
      let obj = {
        id: val.id,
        page: this.listQuerys.page,
        limit: this.listQuerys.limit,
      };
      queryHistoryList(obj).then((res) => {
        this.lists = res.data.data;
        this.counts = res.data.count;
      });
    },
    download(val) {
      if (val.status == 0) {
        location.href =
          "https://saas.jecinfo.com/gateway/api-backup/backup/downloadBackupFile?fileName=" +
          val.fileName;
      } else {
        alert("暂无文件可供下载");
      }
    },
    cancels() {
      this.dialogFormVisibles = false;
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.bools = true;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      let obj = {
        id: this.form.id,
        datasourceName: this.form.datasourceName,
        jdbcUsername: this.form.jdbcUsername,
        jdbcPassword: this.form.jdbcPassword,
        cronStr: this.cron,
        jdbcUrl: this.form.jdbcUrl,
        jobInfoId: this.form.jobInfoId,
        comments: this.form.comments,
      };
      console.log(obj,'===')

      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          saveOrUpdateBackupInfo(obj)
            .then((res) => {
              if (res.status == 200) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
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
