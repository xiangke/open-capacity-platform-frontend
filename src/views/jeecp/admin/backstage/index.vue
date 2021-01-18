<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <!-- <el-button size="mini" type="default" @click="getList" icon="el-icon-refresh">刷新</el-button> -->
      <div style="float: right">
        <el-button
          size="mini"
          type="primary"
          @click="handleAdd"
          icon="el-icon-plus"
          >新 增</el-button
        >
      </div>
    </template>

    <el-table :data="list" style="width: 100%">
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.databaseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表描述">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.tableDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.columnName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="统计描述">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.displayDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="获取方式">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
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
          <el-button
            size="mini"
            type="primary"
            @click="examine(scope.$index, scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增菜单弹框 -->
    <el-dialog title="新增/编辑菜单" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="数据库" prop="value">
          <el-select v-model="form.value" placeholder="请选择">
            <el-option
              v-for="item in Databases"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表名称" prop="value1">
          <el-select v-model="form.value1" placeholder="请选择">
            <el-option
              v-for="(item, index) in TablesByDbname"
              :key="index"
              :label="item.tableName"
              :value="item.tableName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段名称" prop="value2">
          <el-select v-model="form.value2" placeholder="请选择">
            <el-option
              v-for="(item, index) in ColumnsByTableName"
              :key="index"
              :label="item.columnName"
              :value="item.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表描述" prop="tableDesc">
          <el-input v-model="form.tableDesc"></el-input>
        </el-form-item>
        <el-form-item label="统计描述" prop="displayDesc">
          <el-input v-model="form.displayDesc"></el-input>
        </el-form-item>
        <el-form-item label="获取方式" prop="mode">
          <el-select v-model="form.mode" placeholder="请选择">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel" icon="el-icon-close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit('form')"
          v-if="bool"
          icon="el-icon-check"
          >确 定</el-button
        >
        <el-button
          type="primary"
          @click="upda('form')"
          v-else
          icon="el-icon-check"
          >修改</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增菜单弹框 -->
    <el-dialog title="查看详情" :visible.sync="dialogFormVisibles">
      <el-table :data="treeDatas" style="width: 100%">
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <span>{{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancels" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="submits" icon="el-icon-check"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import axios from "axios";
import {
  queryDisplayInfo,
  saveOrUpdateDisplayInfo,
  queryDatabases,
  queryTablesByDbname,
  queryColumnsByTableName,
  deleteDisplayInfo,
  queryDataInfo,
} from "@/api/backstage";

export default {
  data() {
    return {
      list: null,
      dialogFormVisible: false,
      dialogFormVisibles: false,
      treeData: [],
      treeDatas: [],
      bool: false,
      tableKey: 0,
      Databases: [],
      TablesByDbname: [],
      ColumnsByTableName: [],
      options: [
        {
          value: null,
          label: "空",
        },
        {
          value: "max",
          label: "max",
        },
        {
          value: "min",
          label: "min",
        },
        {
          value: "sum",
          label: "sum",
        },
        {
          value: "count",
          label: "count",
        },
        {
          value: "avg",
          label: "avg",
        },
      ],
      form: {
        value: "",
        value1: "",
        value2: "",
        tableDesc: "",
        displayDesc: "",
        mode: null,
      },

      id: null,
      rules: {
        value: [
          {
            required: true,
            message: "请选择数据库",
            trigger: "blur",
          },
        ],
        value1: [
          {
            required: true,
            message: "请选择表名称",
            trigger: "blur",
          },
        ],
        value2: [
          {
            required: true,
            message: "请选择字段名称",
            trigger: "blur",
          },
        ],
        tableDesc: [
          {
            required: true,
            message: "请输入表描述",
            trigger: "blur",
          },
        ],
        displayDesc: [
          {
            required: true,
            message: "请输入统计描述",
            trigger: "blur",
          },
        ],
        mode: [
          {
            required: true,
            message: "请选择获取方式",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.queryDatabases();
  },
  watch: {
    "form.value"(val) {
      let obj = {
        dbName: val,
      };
      queryTablesByDbname(obj).then((res) => {
        if (res.status === 200) {
          this.TablesByDbname = res.data.datas;
        }
      });
    },
    "form.value1"(val) {
      let obj = {
        dbName: this.form.value,
        tableName: val,
      };
      queryColumnsByTableName(obj).then((res) => {
        if (res.status === 200) {
          this.ColumnsByTableName = res.data.datas;
        }
      });
    },
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.bool = false;
      this.form.value = row.databaseName;
      this.form.value1 = row.tableName;
      this.form.value2 = row.columnName;
      this.form.tableDesc = row.tableDesc;
      this.form.displayDesc = row.displayDesc;
      this.form.mode = row.mode;
      this.id = row.id;
    },
    onCancels() {
      this.dialogFormVisibles = false;
    },
    submits() {
      this.dialogFormVisibles = false;
    },
    upda(formName) {
      let obj = {
        databaseName: this.form.value,
        tableName: this.form.value1,
        columnName: this.form.value2,
        tableDesc: this.form.tableDesc,
        displayDesc: this.form.displayDesc,
        mode: this.form.mode,
        id: this.id,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveOrUpdateDisplayInfo(obj)
            .then((res) => {
              if (res.status === 200) {
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
        }
      });
    },
    // 删除数据
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteDisplayInfo(row.id).then((res) => {
          if (res.status === 200) {
            this.getList();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
          }
        });
      });
    },
    queryDatabases() {
      queryDatabases().then((res) => {
        this.Databases = res.data.datas;
      });
    },
    // 获取列表
    getList() {
      queryDisplayInfo().then((res) => {
        if (res.status === 200) {
          this.list = res.data.datas;
        }
      });
    },
    // 打开添加模态框
    handleAdd() {
      this.dialogFormVisible = true;
      this.bool = true;
      this.form.value = "";
      this.form.value1 = "";
      this.form.value2 = "";
      this.form.tableDesc = "";
      this.form.displayDesc = "";
      this.form.mode = null;
    },
    examine(index, val) {
      let obj = {
        databaseName: "`" + val.databaseName + "`",
        tableName: val.tableName,
        columnName: val.columnName,
      };
      this.dialogFormVisibles = true;
      queryDataInfo(obj).then((res) => {
        console.log(res, "====");
        this.treeDatas = res.data.datas;
      });
    },
    // 关闭模态框
    onCancel() {
      this.dialogFormVisible = false;
    },
    // 添加成功
    submit(formName) {
      let obj = {
        databaseName: this.form.value,
        tableName: this.form.value1,
        columnName: this.form.value2,
        tableDesc: this.form.tableDesc,
        displayDesc: this.form.displayDesc,
        mode: this.form.mode,
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveOrUpdateDisplayInfo(obj)
            .then((res) => {
              if (res.status === 200) {
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
              }
              this.dialogFormVisible = false;
            })
            .finally(() => {
              this.dialogFormVisible = false;
            });
        }
      });
    },
  },
};
</script>
