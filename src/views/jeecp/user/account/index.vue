<template>
  <d2-container class="page">
    <el-form
      :model="form"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户头像" prop="name" ref="uploadElement">
        <!-- <el-upload
          ref="upload"
          action="https://saas.jecinfo.com/gateway/api-file/files/upload"
          accept="image/png, image/gif, image/jpg, image/jpeg"
          list-type="picture-card"
          :limit="limitNum"
          :auto-upload="false"
          :before-upload="handleBeforeUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="imgChange"
          :on-success="imgSuccess"
          :class="{ hide: hideUpload }"
        > -->
        <el-upload
          ref="upload"
          action="https://saas.jecinfo.com/gateway/api-file/files/upload"
          accept="image/png, image/gif, image/jpg, image/jpeg"
          list-type="picture-card"
          :limit="limitNum"
          :auto-upload="false"
          :before-upload="handleBeforeUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="imgChange"
          :on-success="imgSuccess"
          :class="{ hide: hideUpload }"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>

      <el-form-item label="用户名" prop="name">
        <el-input v-model="userData.username" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="用户名昵称" prop="nickname">
        <el-input
          v-model="userData.nickname"
          placeholder="请输入用户名昵称"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="userData.phone"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="resource">
        <el-radio-group v-model="radio">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="userData.email"
          placeholder="请输入用户邮箱."
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="部门"> -->
      <!-- <el-input v-model="userData.email" placeholder="请输入用户邮箱"></el-input> -->
      <!-- <el-cascader :options="options" v-model="optionsname" :show-all-levels="false"></el-cascader> -->
      <!-- </el-form-item> -->
      <el-form-item style="float: right; margin-top: 10px">
        <el-button
          size="small"
          type="primary"
          :props="defaultProps"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </d2-container>
</template>
<script>
import { getuser, putObj, putimage, deptList } from "@/api/account";

export default {
  data() {
    return {
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "deptName",
        value: "id",
      },
      hideUpload: false,
      dialogImageUrl: "",
      dialogVisible: false, //图片预览弹窗
      formLabelWidth: "80px",
      limitNum: 1,
      form: {},
      dialogVisible2: true, //弹窗
      imageUrl: "",
      radio: null,
      optionsname: null,
      img: null,
      userData: {
        name: "",
        nickname: "",
        email: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },
  created() {
    this.getuser();
    deptList().then((res) => {
      this.options = res.data.children;
    });
  },
  methods: {
    getuser() {
      getuser().then((res) => {
        this.userData = res.data;
        this.radio = res.data.sex;
        this.imageUrl = res.data.headImgUrl;
        console.log(res);
      });
    },
    imgSuccess(res, file, fileList) {
      console.log(file.response.data,'=====');
      this.img = file.response.data;
      // this.form.icon =
      //   "https://saas.jecinfo.com/gateway/api-file" + file.response.data;
    },
    // 上传文件之前的钩子
    handleBeforeUpload(file) {
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$notify.warning({
          title: "警告",
          message:
            "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片",
        });
      }
      let size = file.size / 1024 / 1024 / 2;
      if (size > 2) {
        this.$notify.warning({
          title: "警告",
          message: "图片大小必须小于2M",
        });
      }
      // let fd = new FormData(); //通过form数据格式来传
      // fd.append("file", file); //传文件
      // putimage(fd).then((res) => {
      //   console.log(res,'1111');
      //   this.img = res.data.data
      // });
    },

    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    imgChange(files, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
      this.$refs.upload.submit();

      if (fileList) {
        this.$refs.uploadElement.clearValidate();
      }
    },
    handleCreate() {
      this.bool = true;
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    open() {
      this.$alert("这是一段内容", "部门选择", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `action: ${action}`,
          });
        },
      });
    },
    submitForm(formName) {
      this.$refs.upload.submit();
      let obj = {
        id: this.userData.id,
        username: this.userData.username,
        nickname: this.userData.nickname,
        phone: this.userData.phone,
        headImgUrl: "https://saas.jecinfo.com/gateway/api-file" + this.img,
        sex: 1,
        email: this.userData.email,
      };
      putObj(obj).then((res) => {
        if (res.status === 200) {
          alert("信息保存成功");
          this.getuser();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  .cell {
    display: flex;
    .item {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 300px;
      & + .item {
        margin-left: 20px;
      }
      .title {
        text-align: center;
        line-height: 2em;
        font-size: 18px;
        font-weight: bold;
        color: #555;
      }
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.hide .el-upload--picture-card {
  display: none;
}
.avatar {
  width: 100%;
  height: 100%;
}
</style>
