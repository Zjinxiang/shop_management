<template>
  <div class="loginbox">
    <div class="login_main">
      <!-- 头像 -->
      <div class="login_logo">
        <img src="@/assets/logo.png" alt="" />
      </div>

      <!-- 输入框 -->
      <div class="login_input">
        <el-form :rules="rules" :model="data" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input
              v-model="data.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-s-custom"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="data.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 登录 -->
      <div class="login_button">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //登录数据绑定
      data: {
        username: "admin",
        password: "123456",
      },

      //验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //重置
    reset() {
      //   console.log(this);
      this.$refs.loginFormRef.resetFields();
    },

    //登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let { data: res } = await this.axios.post("login", {
          username: this.data.username,
          password: this.data.password,
        });
        if (res.meta.status !== 200)
          return this.$message({
            message: "登陆失败",
            type: "error",
            duration: "1000",
          });
        this.$message({
          message: "登陆成功",
          type: "success",
          duration: "500",
        })
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.loginbox {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_main {
    width: 450px;
    height: 300px;
    background-color: white;
    .login_logo {
      width: 130px;
      height: 130px;
      padding: 10px;
      border-radius: 50%;
      border: 1px solid gray;
      box-shadow: 0 0 10px #ddd;
      margin: -65px auto;
      background-color: white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_input {
      width: 90%;
      margin: 80px auto 20px;
    }
    .login_button {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: end;
    }
  }
}
</style>
