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
        <el-form-item label="设备名称" prop="name">
          <el-input
            @keyup.enter.native="handleFilter"
            style="width: 200px"
            placeholder="设备名称"
            v-model="search.deviceSn"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="username">
          <el-select v-model="search.devceTypeId" placeholder="请选择设备类型">
            <el-option label="全部" :value="null" />
            <el-option
              v-for="item in typeData"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="username">
          <el-select v-model="search.status" placeholder="请选择状态">
            <el-option
              v-for="item in status"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search"
            >搜 索</el-button
          >
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus"
            >新 增</el-button
          >
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="deviceInfoLists" style="width: 100%">
      <el-table-column label="ID" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名字">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编码">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceSn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span :class="scope.row.status == 0 ? 'cn' : 'on'">{{
            scope.row.status | timefilters
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="modification(scope.$index, scope.row)"></el-button> -->
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            icon="el-icon-delete"
          ></el-button> -->
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
      >
      </el-pagination>
    </template>
    <!-- 查看信息弹框 -->
    <el-dialog title="查看信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="100px">
        <el-table :data="reportdata" style="width: 100%">
          <el-table-column label="设备编码">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.tags.host }}</span>
            </template>
          </el-table-column>
          <el-table-column label="采集时间">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字段" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.tags.index }}</span>
            </template>
          </el-table-column>
          <el-table-column label="值">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template slot="footer">
        <el-pagination
          background
          @size-change="handleSizeChanges"
          @current-change="handleCurrentChanges"
          :current-page.sync="obj.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="obj.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          style="margin: -10px"
        >
        </el-pagination>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel" icon="el-icon-close">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增菜单弹框 -->
    <el-dialog title="新增/编辑菜单" :visible.sync="dialogFormVisibleadd">
      <el-form :model="forms" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="forms.name"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="devceTypeId">
          <el-select v-model="forms.devceTypeId" placeholder="请选择类型">
            <el-option
              v-for="item in typeData"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码" prop="deviceSn">
          <el-input v-model="forms.deviceSn"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="forms.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancels" icon="el-icon-close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit('form')"
          v-if="bools"
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
  </d2-container>
</template>
<script>
import {
  getdeviceInfoLists,
  update,
  reportdata,
  addSave,
  getdeviceTypeList,
  deleteDeviceInfoById,
} from "@/api/equipment";
export default {
  data() {
    return {
      list: null,
      dialogFormVisible: false,
      dialogFormVisibleadd: false,
      treeData: [],
      deviceSn: null,
      reportdata: [],
      bool: false,
      bools: false,
      typeData: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        devceTypeId: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
          },
        ],
        deviceSn: [
          {
            required: true,
            message: "请输入设备编码",
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      sexs: [
        {
          id: 0,
          label: "",
        },
        {
          id: 1,
          label: "",
        },
      ],
      status: [
        {
          id: 0,
          label: "在线",
        },
        {
          id: 1,
          label: "离线",
        },
        {
          id: null,
          label: "全部",
        },
      ],
      search: {
        deviceSn: null,
        status: null,
        devceTypeId: null,
      },
      form: {
        path: undefined,
        menuName: undefined,
      },
      forms: {
        id: null,
        name: null,
        devceTypeId: null,
        deviceSn: null,
        remark: null,
      },
      tableKey: 0,
      deviceInfoLists: [],
      listQuery: {
        page: 1,
        limit: 10,
      },
      obj: {
        typeId: null,
        host: null,
        page: 1,
        limit: 10,
      },
      total: null,
      totals: null,
    };
  },
  filters: {
    timefilters(val) {
      if (val === 0) {
        return "在线";
      } else {
        return "离线";
      }
    },
  },
  created() {
    this.getLists();
    getdeviceTypeList().then((res) => {
      this.typeData = res.data.data;
      console.log(res);
    });
  },
  methods: {
    // 查看信息
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.bool = false;
      this.form.path = row.path;
      this.form.id = row.id;
      this.obj.typeId = row.devceTypeId;
      this.obj.host = row.deviceSn;
      this.getreportdata();
      console.log(row)
    },
    // 查看修改信息
    modification(index, row) {
      this.dialogFormVisibleadd = true;
      this.bools = false;
      this.forms.name = row.name;
      this.forms.id = row.id;
      this.forms.devceTypeId = row.deviceTypeName;
      this.forms.deviceSn = row.deviceSn;
      this.forms.remark = row.remark;
    },
    // 确认修改信息
    upda(formName) {
      console.log(this.forms.devceTypeId);
      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          update(this.forms)
            .then((res) => {
              this.getLists();
            })
            .finally(() => {
              this.dialogFormVisibleadd = false;
            });
        } else {
          return false;
        }
      });
    },
    // 删除信息
    handleDelete(index, row) {
      let obj = {
        id: row.id,
      };
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteDeviceInfoById(obj).then((res) => {
          if (res.status === 200) {
            this.getLists();
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
    // 新增信息
    submit(formName) {
      let obj = {
        name: this.forms.name,
        devceTypeId: this.forms.devceTypeId,
        deviceSn: this.forms.deviceSn,
        remark: this.forms.remark,
      };
      const set = this.$refs;
      set[formName].validate((valid) => {
        if (valid) {
          addSave(obj)
            .then((res) => {
              if (res.status === 200) {
                this.getLists();
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
              }
            })
            .finally(() => {
              this.dialogFormVisibleadd = false;
            });
        } else {
          return false;
        }
      });
    },
    getreportdata() {
      reportdata(this.obj).then((res) => {
        console.log(res,'===')
        if (res.data.resp_code === 0) {
          this.reportdata = res.data.datas.list;
          this.totals = res.data.datas.total;
        } else {
          this.reportdata = [];
          this.totals = 0;
        }
      });
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1;
      let obj = {
        name: this.search.deviceSn,
        status: this.search.status,
        devceTypeId: this.search.devceTypeId,
        page: this.listQuery.page,
        limit: this.listQuery.limit,
      };
      getdeviceInfoLists(obj).then((res) => {
        this.total = res.data.count;
        this.deviceInfoLists = res.data.data;
      });
    },
    getLists() {
      let obj = {
        name: this.search.deviceSn,
        status: this.search.status,
        page: this.listQuery.page,
        devceTypeId: this.search.devceTypeId,
        limit: this.listQuery.limit,
      };
      console.log(obj);
      getdeviceInfoLists(obj).then((res) => {
        this.total = res.data.count;
        this.deviceInfoLists = res.data.data;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getLists();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      console.log("123");
      this.getLists();
    },
    handleSizeChanges(val) {
      this.obj.limit = val;
      this.getreportdata();
    },
    handleCurrentChanges(val) {
      this.obj.page = val;
      this.getreportdata();
    },
    // 新增信息
    handleAdd() {
      this.dialogFormVisibleadd = true;
      this.bools = true;
      this.forms = {};
    },
    onCancels() {
      this.dialogFormVisibleadd = false;
    },
    onCancel() {
      this.dialogFormVisible = false;
    },
  },
};
</script>
<style>
.dialog-footer {
  margin-top: 20px;
}
.on {
  color: red;
}
.cn {
  color: green;
}
</style>
