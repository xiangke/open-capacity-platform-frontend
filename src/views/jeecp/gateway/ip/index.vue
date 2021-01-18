<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
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
      <el-table-column label="ID" width="50">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="白名单路径">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.createTime | timefilters
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.row.updateTime | timefilters
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button> -->
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增菜单弹框 -->
    <el-dialog title="新增/编辑菜单" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="IP" prop="path">
          <el-input v-model="form.ip"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="path">
          <el-input v-model="form.mark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel" icon="el-icon-close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit"
          v-if="bool"
          icon="el-icon-check"
          >确 定</el-button
        >
        <el-button type="primary" @click="upda" v-else icon="el-icon-check"
          >修改</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      list: null,
      dialogFormVisible: false,
      treeData: [],
      bool: false,
      form: {
        ip: undefined,
        mark: undefined,
      },
      tableKey: 0,
    };
  },
  filters: {
    timefilters(val) {
      if (val == null || val == "") {
        return "—";
      } else {
        let d = new Date(val);
        let month =
          d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
        let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        let times =
          d.getFullYear() +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          min +
          ":" +
          sec;
        return times;
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.bool = false;
      this.form.path = row.path;
      this.form.id = row.id;
    },
    upda() {
      axios
        .post("https://saas.jecinfo.com/gateway/white/update", {
          id: this.form.id,
          path: this.form.path,
        })
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
        });
      this.dialogFormVisible = false;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios
          .post("https://saas.jecinfo.com/gateway/ipfilter/delete/" + row.id)
          .then((res) => {
            this.getList();
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
    getList() {
      axios
        .get("https://saas.jecinfo.com/gateway/ipfilter/findAll")
        .then((res) => {
          this.list = res.data;
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
    submit() {
      axios
        .post("https://saas.jecinfo.com/gateway/ipfilter/add", this.form)
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
        });
      this.dialogFormVisible = false;
    },
  },
};
</script>