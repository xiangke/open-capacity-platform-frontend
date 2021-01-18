<template>
  <el-form
    class="header"
    :inline="true">
      <!-- <el-form-item label="搜索" prop="permission">
        <el-input @keyup.enter.native="search" style="width: 200px;" :value="value" @input="inputChange" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="search" icon="el-icon-search">搜 索</el-button>
      </el-form-item> -->
      <el-form-item style="float: right">
        <el-button @click="add" type="primary" icon="el-icon-plus">新 增</el-button>
      </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: {
        value: ''
      }
    }
  },
  methods: {
    inputChange (val) {
      console.log(val)
      this.$emit('update:value', val)
    },
    search () {
      this.$emit('search')
    },
    add () {
      this.$emit('add')
    }
  }
}
</script>
