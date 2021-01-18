<template>
  <div ref="table">
    <el-table :data="data"
              v-loading="listLoading"
              element-loading-text="拼命加载中..."
              highlight-current-row
              stripe
              :height="height"
              style="width: 100%">
      <el-table-column
        prop="user_id"
        align="center"
        label="用户编号"
        width="120"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="user_name"
        align="center"
        label="用户名称"
        width="140"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="client_id"
        align="center"
        label="应用标识"
        width="160"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="token_type"
        align="center"
        label="类型"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="token_value"
        align="center"
        label="token"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="grant_type"
        align="center"
        label="授权方式"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column
        prop="user_head_imgurl"
        align="center"
        label="用户头像"
        width="120"
      >
        <template slot-scope="{ row }">
          <img :src="row.user_head_imgurl"  class="layui-badge layui-bg-gray" />
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" type="danger" @click="handleDelete(row.token_value)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="listQuery.page"
      :page-sizes="[10,20,30,50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="padding-top: 16px;">
    </el-pagination>
  </div>
</template>

<script>
import { tokenList, deleteToken } from '@/api/token'

export default {
  data () {
    return {
      listLoading: false,
      height: 100,
      data: [],
      total: null,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.$nextTick(() => {
      this.tableHeightCalc()
      window.onresize = this.tableHeightCalc()
    })
  },
  methods: {
    tableHeightCalc () {
      this.height = window.innerHeight - this.$refs.table.offsetTop - 200
    },
    getData () {
      this.listLoading = true
      const params = {
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
      tokenList(params).then(res => {
        this.listLoading = false
        this.data = res.data.data
        this.total = res.data.count
      })
    },
    handleDelete (id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteToken({ access_token: id })
          .then(res => {
            this.$message.success('删除成功!')
            this.getData()
          })
      })
    },
    handleShow (id) {
      this.$emit('show', id)
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getData()
    }
  }
}
</script>

<style>

.layui-badge{
  width: auto;
  height: 80px;
}
</style>
