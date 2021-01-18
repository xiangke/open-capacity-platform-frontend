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
        prop="clientId"
        align="center"
        label="应用标识"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="clientName"
        align="center"
        label="应用名称"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="clientSecretStr"
        align="center"
        label="应用密钥"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="webServerRedirectUri"
        align="center"
        label="回调地址"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="authorizedGrantTypes"
        align="center"
        label="oauth授权方式"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="状态"
        width="110"
      >
        <template slot-scope="{ row }">
          <el-switch :key="row.id" active-color="#13ce66" inactive-color="#ff4949" v-model="row.status" @change="statusChange(row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(row)"></el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)" icon="el-icon-delete"></el-button>
          <el-button size="mini" type="success" @click="handleShow(row.id)" icon="el-icon-s-tools"></el-button>
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
import { clients, updateEnabled, deleteClient } from '@/api/clients'

export default {
  props: {
    searchKey: {
      type: String,
      required: true
    }
  },
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
      this.height = window.innerHeight - this.$refs.table.offsetTop - 250
    },
    getData () {
      this.listLoading = true
      const params = {
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        searchKey: this.searchKey
      }
      clients(params).then(res => {
        console.log(res)
        this.listLoading = false
        this.data = res.data.data
        this.total = res.data.count
      })
    },
    statusChange (data) {
      const params = {
        id: data.id,
        status: !!data.status
      }
      updateEnabled(params)
        .then(res => {
          const data = res.data
          if (data.resp_code === 0) {
            this.$message.success('状态修改成功')
          } else {
            this.$message.error('状态修改失败')
            this.data.map(item => {
              if (item.id === params.id) {
                item.status = !item.status
              }
            })
          }
        })
    },
    handleEdit (data) {
      this.$emit('edit', data)
    },
    handleDelete (id) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClient(id)
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
