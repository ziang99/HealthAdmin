<template>
  <div class="login_bg">
    <div class="login_box">
      <!-- logo图像 -->
      <div class="logoImage">
        <img src="~assets/img/logo.jpg" />
      </div>
      <!-- 表单区域 -->
      <el-form class="form_box" ref="form_box" :model="form_data" :rules="form_rules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="form_data.username" clearable />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="form_data.password"
            show-password
            clearable
          />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="button_box">
          <el-button type="primary" @click="goLogin">登录</el-button>
          <el-button type="info" @click="reset_form">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 背景气泡 -->
    <LoginBg />
  </div>
</template>

<script>
  import { getLogin } from "network/login.js";
  import LoginBg from "@/plugins/LoginBg.vue";
  export default {
    name: "Login",
    components: { LoginBg },
    data() {
      return {
        // 表单数据对象
        form_data: { username: "", password: "" },
        // 表单验证规则
        form_rules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 2, max: 9, message: "长度在 2 到 9 个字符", trigger: "blur" }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 2, max: 9, message: "长度在 2 到 9 个字符", trigger: "blur" }
          ]
        }
      };
    },
    methods: {
      // 点击重置按钮，重置表单数据
      reset_form() {
        this.$refs.form_box.resetFields();
      },
      // 点击登录，进行登录操作
      goLogin() {
        this.$refs.form_box.validate(async valid => {
          if (valid) {
            // 接下来就是将用户输入的已经通过校验的form_data数据传给后台做验证
            let { username, password } = this.form_data;
            let res = await getLogin(username, password);
            // console.log(res);
            if (res.code !== 200) {
              this.$message.error({
                message: "账号或密码错误",
                center: true,
                showClose: true
              });
            }else{
              this.$message.success({
                message: "登录成功",
                center: true,
                showClose: true
              });
              // 将数据中的token令牌、用户名等信息存储到 sessionStorage 中
              window.sessionStorage.setItem('token', res.data.token)
              window.sessionStorage.setItem('username', res.data.username)
              this.$router.replace("/home");
            }
          }
        });
      }
    }
  };
</script>

<style scoped>
.login_bg {
  background-color: #2b4b6b;
  width: 100%;
  height: 100vh;
}
.login_box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
}
.logoImage {
  width: 130px;
  height: 130px;
  border: #eee solid 1px;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logoImage img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.form_box {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.button_box {
  display: flex;
  justify-content: center;
}
</style>