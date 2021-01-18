<template>
  <div ref="table">
    <tree-table
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      :data="treeData"
      :height="height"
    >
      <el-table-column label="服务名称">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务路径">
        <template slot-scope="{ row }">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="160" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.isMenu == 2">API</span>
          <span v-else-if="row.parentId == -1">服务</span>
          <span v-else>API</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(row)"></el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import { findAlls, deleteClient } from '@/api/services'

export default {
  data () {
    return {
      listLoading: false,
      treeData: [],
      height: 100
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
      this.height = window.innerHeight - this.$refs.table.offsetTop - 220
    },
    getData () {
      this.listLoading = true
      findAlls().then(res => {
        this.listLoading = false
        const data = res.data.data
        const _data = data.filter(item => item.parentId === -1)
        data.map(item => {
          if (item.parentId !== -1) {
            const obj = _data.find(_item => item.parentId === _item.id)
            if (!obj.hasOwnProperty('children')) {
              obj.children = []
            }
            obj.children.push(item)
          }
        })
        this.treeData = _data
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
    }
  }
}
</script>
