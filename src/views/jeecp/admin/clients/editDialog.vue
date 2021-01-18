<template>
  <el-dialog
    title="修改应用"
    :visible="visible"
    width="500px"
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
        label="应用标识"
      >
        <el-input
          v-model="form.clientId"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="应用密钥"
        prop="clientSecretStr"
      >
        <el-input
          v-model="form.clientSecretStr"
        />
      </el-form-item>
      <el-form-item
        label="回调地址"
      >
        <el-input
          v-model="form.webServerRedirectUri"
          :disabled="true"
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
import { saveOrUpdate } from '@/api/clients'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      form: {
        clientId: '',
        clientSecretStr: '',
        webServerRedirectUri: ''
      },
      rules: {
        clientSecretStr: [
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
      const params = { id: this.data.id, ...this.form }
      saveOrUpdate(params)
        .then(res => {
          const data = res.data
          if (data.resp_code === 0) {
            this.$message.success('修改应用成功')
            this.close()
            this.$emit('updateTable')
          } else {
            this.$message.error(data.resp_msg)
          }
        })
    },
    open () {
      this.form.clientId = this.data.clientId
      this.form.clientSecretStr = this.data.clientSecretStr
      this.form.webServerRedirectUri = this.data.webServerRedirectUri
    },
    close () {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style>

</style>
