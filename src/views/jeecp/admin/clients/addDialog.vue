<template>
  <el-dialog
    title="增加应用"
    :visible="visible"
    width="500px"
    :before-close="close"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
    >
      <el-form-item
        label="应用标识"
        prop="clientId"
      >
        <el-input
          v-model="form.clientId"
        />
      </el-form-item>
      <el-form-item
        label="应用名称"
        prop="clientName"
      >
        <el-input
          v-model="form.clientName"
        />
      </el-form-item>
      <el-form-item
        label="回调地址"
        prop="webServerRedirectUri"
      >
        <el-input
          v-model="form.webServerRedirectUri"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'

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
        clientId: '',
        clientName: '',
        webServerRedirectUri: ''
      },
      rules: {
        clientId: [
          { required: true, message: '请输入', trigger: 'change' },
          { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              const reg = /^[a-zA-Z0-9]+$/
              if (!reg.test(value)) {
                callback(new Error('只能包含英文和数字'))
              } else {
                callback()
              }
            }
          }
        ],
        clientName: [
          { required: true, message: '请输入', trigger: 'change' },
          { min: 0, max: 5, message: '长度在 0 到 20 个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              const reg = /^[\u4e00-\u9fa5]+$/
              if (!reg.test(value)) {
                callback(new Error('只能包含中文'))
              } else {
                callback()
              }
            }
          }
        ],
        webServerRedirectUri: [
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
      axios({
        url: 'https://saas.jecinfo.com/gateway/api-auth/clients/saveOrUpdate',
        method: 'post',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer 3e137c4a-0f69-415b-9415-bf35411f6a26' }
      }).then((res) => {
        if (res.data.resp_code === 0) {
          this.$message.success('添加应用成功')
          this.close()
          this.$emit('updateTable')
        } else {
          this.$message.error(res.data.resp_msg)
        }
      })
    },
    close () {
      this.$refs.form.resetFields()
      console.log(this.form)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style>

</style>
