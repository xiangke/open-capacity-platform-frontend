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
            v-model="listQuery.key"
            placeholder="请输入流程KEY"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search"
            >搜 索</el-button
          >
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="OnlineDrawingProcess"
            v-hasPermi="['activiti:modeler']"
            >在线绘制流程
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- table表格 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column label="流程ID" align="center" prop="id" />
      <el-table-column label="流程KEY" align="center" prop="key" />
      <el-table-column label="流程名称" align="center" prop="name" />
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="部署时间" align="center" prop="deploymentTime" />
      <el-table-column label="部署ID" align="center" prop="deploymentId" />
      <el-table-column label="状态" align="center" prop="suspendState">
        <template slot-scope="scope">
          <span>{{ scope.row.suspendState != 1 ? "挂起" : "激活" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="OnlineModificationProcess(scope.row)"
            v-hasPermi="['activiti:modeler']"
            >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="suspendOrActiveApply(scope.row)"
            v-hasPermi="['activiti:modeler']"
            >{{ scope.row.suspendState == 1 ? "挂起" : "激活" }}
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['activiti:modeler']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--bpmnjs在线流程设计器-->
    <el-dialog
      :visible.sync="modelVisible"
      title="流程图"
      width="1680px"
      @close="modelCancel"
      append-to-body
    >
      <div style="position: relative; height: 100%">
        <iframe
          id="iframe"
          :src="modelerUrl"
          frameborder="0"
          width="100%"
          height="720px"
          scrolling="auto"
        ></iframe>
      </div>
    </el-dialog>
    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.pageSize"
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
        <el-form-item label="模型名称" prop="modelName">
          <el-input
            v-model="form.modelName"
            placeholder="请输入模型名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="key值" prop="key">
          <el-input v-model="form.key" placeholder="请输入key"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close"
          >取 消</el-button
        >
        <el-button type="primary" @click="create('form')" icon="el-icon-check"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import axios from "axios";
import { cron } from "vue-cron";

export default {
  components: { cron },
  name: "table_user",
  data() {
    return {
      modelerUrl: "",
      modelVisible: false,
      cronPopover: false,
      cron: "",
      forms: {
        pageNum: 1,
        pageSize: 10,
      },
      bool: true,
      bools: true,
      list: [],
      total: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        rev: null,
        name: null,
        type: null,
      },
      form: {
        modelName: undefined,
        description: undefined,
        key: undefined,
      },
      rules: {
        modelName: [
          {
            required: true,
            message: "请输入模型名称",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入描述",
            trigger: "blur",
          },
        ],
        key: [
          {
            required: true,
            message: "请输入key",
            trigger: "blur",
          },
        ],
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑信息",
        create: "新增信息",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeCron(val) {
      this.cron = val;
    },
    OnlineDrawingProcess() {
      this.modelVisible = true;
      localStorage.setItem("VUE_APP_BASE_API", process.env.VUE_APP_BASE_API);
      this.modelerUrl = "/bpmnjs/index.html?type=addBpmn";
    },
    OnlineModificationProcess(data) {
      this.modelVisible = true;
      localStorage.setItem("VUE_APP_BASE_API", process.env.VUE_APP_BASE_API);
      this.modelerUrl =
        "/bpmnjs/index.html?type=lookBpmn&deploymentFileUUID=" +
        data.deploymentId +
        "&deploymentName=" +
        encodeURI(data.resourceName);
    },
    // 获取列表数据
    getList() {
      axios({
        url: "https://saas.jecinfo.com/activiti/processDefinition/list",
        method: "get",
        params: this.listQuery,
      }).then((res) => {
        console.log(res);
        this.list = res.data.rows;
        this.total = res.data.total;
      });
    },
    suspendOrActiveApply(row) {
      var suspendOrActive = row.suspendState === "2" ? "激活" : "挂起";
      this.$confirm("确认要" + suspendOrActive + "流程定义吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        var data = { id: row.id, suspendState: row.suspendState };
        axios({
          url:
            "https://saas.jecinfo.com/activiti/processDefinition/suspendOrActiveApply/",
          method: "post",
          data: data,
        })
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              this.$notify({
                title: "成功",
                message: "操作成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
            }
          })
          .catch(function () {});
      });
      // .then(() => {
      //   this.getList();
      //   this.msgSuccess("转换成功");
      // })
      // .catch(function () {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios({
          url:
            "https://saas.jecinfo.com/activiti/processDefinition/remove/" +
            row.deploymentId,
          method: "delete",
        }).then((res) => {
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
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    //查看数据
    examine() {},
    cancel(formName) {
      this.dialogFormVisible = false;
      this.bools = true;
      this.$refs[formName].resetFields();
    },
    modelCancel() {
      this.getList();
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
