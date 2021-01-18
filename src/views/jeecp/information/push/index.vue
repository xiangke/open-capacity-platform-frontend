<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form :inline="true" size="mini" style="margin-bottom: -18px;">
        <el-form-item label prop="username">
          <el-select v-model="type" placeholder="请选择应用名称">
            <el-option
              v-for="item in statuss"
              :key="item.id"
              :label="item.label"
              :value="item.clientName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="username">
          <el-select v-model="type" placeholder="请选择状态">
            <el-option v-for="item in status" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button size="mini" type="primary" @click="handleAdd" icon="el-icon-plus">新 增</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div>
      <span>{{name}}</span>条数：
      <span>{{sum}}</span>
    </div>
    <el-table :data="arr.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%">
      <el-table-column label="ID" width="80">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息内容">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息标题" width="300">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名称" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.appName | timefilters }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息时间" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sendTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="200"> -->
      <!-- <template slot-scope="scope"> -->
      <!-- 查看信息 -->
      <!-- <el-button type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button> -->
      <!-- 修改信息 -->
      <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="modification(scope.$index, scope.row)"></el-button> -->
      <!-- 删除信息 -->
      <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button> -->
      <!-- </template> -->
      <!-- </el-table-column> -->
    </el-table>
    <template slot="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="arr.length"
      ></el-pagination>
    </template>
    <!-- 新增菜单弹框 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="手机">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="Id">
          <el-select v-model="form.appid" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="submit" icon="el-icon-check">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import axios from "axios";
import { getappid, postsend, getcount, all, getmessage } from "@/api/push";
export default {
  data() {
    return {
      arr: [],
      bool: true,
      dialogFormVisible: false,
      form: {
        mobile: undefined,
        appid: undefined,
      },
      obj: {
        page: 1,
        linit: 10,
      },
      options: [],
      type: null,
      statuss: null,
      status: [
        {
          id: 0,
          label: "短信",
        },
        {
          id: 1,
          label: "消息",
        },
        {
          id: null,
          label: "全部",
        },
      ],
      currentPage: 1, //  初始页
      pagesize: 10, //    每页的数据
      name: "全部",
      sum: null,
    };
  },
  filters: {
    timefilters(val) {
      if (val == null || val == "") {
        return "—";
      } else {
        return val;
      }
    },
  },
  created() {
    //获取列表
    axios
      .post("https://saas.jecinfo.com/gateway/api-message/message/list", this.obj)
      .then((res) => {
        this.arr = res.data.data;
        this.sum = this.arr.length;
        console.log(res);
      });
    all().then((res) => {
      this.statuss = res.data;
      // if (res.data.resp_code === 0) {
      //   this.$message.success("添加应用成功");
      //   this.close();
      //   this.$emit("updateTable");
      // } else {
      //   this.$message.error(res.data.resp_msg);
      // }
      console.log(res);
    });
    // axios({
    //   url: "http://61.164.218.155:39200/api-auth/clients/all",
    //   method: "get",
    //   headers: {
    //     Authorization: "Bearer 0d6dbec7-be55-41e4-a9c8-99d7213c5e98",
    //   },
    // }).then((res) => {});

    //获取appid
    getappid().then((res) => {
      this.options = res.data;
    });
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); // 每页下拉显示数据
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); // 点击第几页
    },
    // 搜索
    handleFilter() {
      if (this.type === 0) {
        this.name = "短信";
      } else if (this.type === 1) {
        this.name = "消息";
      } else {
        this.name = "全部";
      }
      let obj = {
        type: this.type,
      };
      getcount(obj).then((res) => {
        console.log(res);
        if (res.status === 200 && this.type != null) {
          this.sum = res.data.resp_msg;
        } else {
          this.sum = this.arr.length;
        }
      });
    },
    // 查看数据
    handleEdit() {},
    // 修改信息
    modification() {},
    // 删除信息
    handleDelete() {},
    //打开模态框
    handleAdd() {
      this.dialogFormVisible = true;
      this.bool = true;
    },
    onCancel() {
      this.dialogFormVisible = false;
    },
    // 新增
    submit() {
      postsend(this.form).then((res) => {
        this.dialogFormVisible = false;
        if (res.status === 200) {
          alert(res.data.resp_msg);
        }
      });
    },
  },
};
</script>