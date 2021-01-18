<template>
  <el-dialog
    title="添加服务"
    :visible="visible"
    width="450px"
    :before-close="close"
    @open="open"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
    >
      <el-form-item
        label="服务名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item
        label="服务路径"
        prop="path"
      >
        <el-input
          v-model="form.path"
        />
      </el-form-item>
      <el-form-item
        label="是否为服务"
        prop="isMenu"
      >
        <el-radio v-model="form.isMenu" label="1">是</el-radio>
        <el-radio v-model="form.isMenu" label="2">否</el-radio>
      </el-form-item>
      <el-form-item
        label="排序号"
        prop="sort"
      >
        <el-input
          v-model="form.sort"
        />
      </el-form-item>
      <el-form-item
        label="上级服务"
        prop="parentId"
      >
        <el-select v-model="form.parentId">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveOrUpdate, findOnes } from '@/api/services'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      form: {
        name: '',
        path: '',
        isMenu: '1',
        sort: '',
        parentId: '-1'
      },
      options: [
        { id: '-1', name: '顶级服务' }
      ],
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        isMenu: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.update()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    update () {
      const params = { ...this.form }
      saveOrUpdate(params)
        .then(res => {
          const data = res.data
          if (data.resp_code === 0) {
            this.$message.success('添加服务成功')
            this.close()
            this.$emit('updateTable')
          } else {
            this.$message.error(data.resp_msg)
          }
        })
    },
    getOptions () {
      findOnes()
        .then(res => {
          const data = res.data.data
          const _data = data.filter(item => item.parentId === -1)
          this.options = this.options.concat(_data)
        })
    },
    open () {
      this.getOptions()
    },
    close () {
      this.$refs.form.resetFields()
      this.options = [
        { id: '-1', name: '顶级服务' }
      ]
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style>

</style>
