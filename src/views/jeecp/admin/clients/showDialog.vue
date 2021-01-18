<template>
  <el-dialog
    title="服务管理"
    :visible="visible"
    width="500px"
    :before-close="close"
    @open="open"
  >
    <el-tree
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      :props="defaultProps"
      :default-checked-keys="checked"
      v-loading="loading"
    />
    <div slot="footer" class="dialog-footer" v-show="!loading">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { showClient, granted } from '@/api/clients'

export default {
  props: {
    id: {
      type: Number,
      required: false
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      data: [],
      checked: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      showClient(this.id)
        .then(res => {
          this.loading = false
          const data = res.data
          const _data = data.filter(item => item.pId === -1)
          const checked = []
          data.map(item => {
            if (item.pId !== -1) {
              const obj = _data.find(_item => item.pId === _item.id)
              if (!obj.hasOwnProperty('children')) {
                obj.children = []
              }
              obj.children.push(item)
            }
            if (item.checked) { // 选中数组
              checked.push(item.id)
            }
          })
          this.data = _data
          this.checked = checked
        })
    },
    submit () {
      const serviceIds = this.$refs.tree.getCheckedKeys()
      const params = {
        id: this.id,
        serviceIds
      }
      this.submitLoading = true
      granted(params)
        .then(res => {
          this.submitLoading = false
          const data = res.data
          if (data.resp_code === 0) {
            this.$message.success('保存成功')
            this.close()
          } else {
            this.$message.error(data.resp_msg)
          }
        })
    },
    open () {
      this.getData()
    },
    close () {
      this.data = []
      this.checked = []
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style>

</style>
