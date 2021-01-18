<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form
        :inline="true"
        size="mini"
        style="margin-bottom: -18px;">
          <!-- <el-form-item label="设备名称" prop="name">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="设备名称" v-model="search.deviceSn" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="username">
            <el-select v-model="search.status"  placeholder="请选择状态">
                <el-option
                        v-for="item in status"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
          </el-form-item>
           <el-form-item style="float: right">
            <el-button  type="primary" @click="handleAdd" icon="el-icon-plus">新 增</el-button>
          </el-form-item> -->
      </el-form>
    </template>
    <el-table :data="userList.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%">
      <el-table-column label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.appclass }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编码">
        <template slot-scope="scope">
          <span>{{ scope.row.devtype }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备描述">
        <template slot-scope="scope">
          <span >{{ scope.row.devtypedesc}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary"  size="mini" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="modification(scope.$index, scope.row)"></el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column> -->
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
          :total="userList.length">
        </el-pagination>
    </template>
  </d2-container>
</template>
<script>
import { getName } from '@/api/karat'
export default {
  data () {
    return {
      currentPage: 1, //  初始页
      pagesize: 10, //    每页的数据
      userList: []
    }
  },
  filters: {
    timefilters (val) {
      if (val === 0) {
        return '在线'
      } else {
        return '离线'
      }
    }
  },
  created () {
    this.handleUserList()
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    handleUserList () {
      getName().then(res => {
        this.userList = res.data.datas
        console.log(this.userList)
      })
    }
  }

}
</script>

<style>
.dialog-footer{
  margin-top: 20px;
}
.on{
  color: red;
}
.cn{
  color: green;
}
</style>
