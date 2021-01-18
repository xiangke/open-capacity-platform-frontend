<template>
  <div class="page-login">
    <div class="page-login--layer">
      <div class="page-login-tltle"></div>
      <div class="page-login-box">
        <div class="page-login--form">
          <el-card shadow="never">
            <el-form
              ref="loginForm"
              label-position="top"
              :rules="rules"
              :model="formLogin"
              size="default"
            >
              <el-form-item prop="username">
                <el-input
                  type="text"
                  v-model="formLogin.username"
                  placeholder="请输入用户名"
                >
                  <template slot="prepend"><img src="./image/people.png" alt=""></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="formLogin.password"
                  placeholder="请输入密码"
                >
                  <template slot="prepend"><img src="./image/lock.png" alt=""></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  type="text"
                  v-model="formLogin.code"
                  placeholder="请输入验证码"
                >
                  <template slot="prepend"><img src="./image/protect.png" alt=""></template>
                  <template slot="append">
                    <img
                      class="login-code"
                      :src="code.src"
                      @click="refreshCode"
                    />
                  </template>
                </el-input>
              </el-form-item>
              <div class="login-remember">
                <p><input type="checkbox" class="login-checkbox"> 记住密码</p>
                <p>忘记密码？</p>
              </div>
              <el-button
                size="default"
                @click="submit"
                type="primary"
                class="button-login"
                >登录</el-button
              >
              <div class="login-register">
                没有账号? <span><b>立即注册</b></span>
              </div>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { mapActions } from "vuex";
import util from "@/libs/util";
import { sendSmsCode } from "@/api/user";
import "./style.scss";
export default {
  data() {
    return {
      timeInterval: null,
      time: dayjs().format("HH:mm:ss"),
      activeName: "first",
      // 表单
      formLogin: {
        username: "",
        password: "",
        randomStr: "",
        code: "",
      },
      // 校验
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      mobileLogin: {
        mobile: "17034642111",
        code: "",
      },
      mobileRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "手机号不合法",
            trigger: "blur",
          },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      code: {
        len: 4,
        src: "",
      },
      sms: {
        btnName: "发送短信",
        isDisabled: false,
        time: 60,
      },
    };
  },
  mounted() {
    this.timeInterval = setInterval(() => {
      this.refreshTime();
    }, 1000);
    this.refreshCode();
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    ...mapActions("d2admin/account", ["login", "loginByPhone"]),
    refreshTime() {
      this.time = dayjs().format("HH:mm:ss");
    },
    /**
     * 刷新验证码
     */
    refreshCode() {
      this.formLogin.code = "";
      this.formLogin.randomStr = util.randomLenNum(this.code.len, true);
      this.code.src = `${process.env.VUE_APP_BASE_URL}/api-auth/validata/code/${this.formLogin.randomStr}`;
    },
    /**
     * 用户密码登录
     */
    submit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.login(Object.assign({ vm: this }, this.formLogin));
        }
      });
    },
    /**
     *  发送短信
     */
    sendMsg() {
      let me = this;
      me.$refs.mobileForm.validateField("mobile", (error) => {
        if (!error) {
          sendSmsCode(me.mobileLogin.mobile).then(({ data }) => {
            if (data.status === "SUCCEED") {
              this.$notify({
                title: "验证码发送成功",
                message: "验证码为:" + data.result,
                type: "success",
                duration: 6000,
              });
              doInterval();
            }
          });
        }
      });
      function doInterval() {
        me.sms.isDisabled = true;
        let interval = window.setInterval(function () {
          me.sms.btnName = "（" + me.sms.time + "秒）后重新发送";
          --me.sms.time;
          if (me.sms.time < 0) {
            me.sms.btnName = "重新发送";
            me.sms.time = 10;
            me.sms.isDisabled = false;
            window.clearInterval(interval);
          }
        }, 1000);
      }
    },
    /**
     * 手机号登录
     */
    mobileSubmit() {
      this.$refs.mobileForm.validate((valid) => {
        if (valid) {
          this.loginByPhone({
            vm: this,
            mobile: this.mobileLogin.mobile,
            code: this.mobileLogin.code,
          });
        }
      });
    },
  },
};
</script>
