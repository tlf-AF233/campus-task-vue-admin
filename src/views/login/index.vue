<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          id="account"
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入邮箱或手机号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          id="psw"
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="roleCode" class="btn-line">
        <el-radio v-model="loginForm.roleCode" label="TEACHER">我是老师</el-radio>
        <el-radio v-model="loginForm.roleCode" label="STUDENT">我是学生</el-radio>
      </el-form-item>
      <el-divider></el-divider>
      

      <div class="btn-line">
      <el-button
        id="login_btn"
        :loading="loading"
        type="primary"
        style="width: 50%; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
      
      <el-button
        id="register_btn"
        :loading="loading"
        type="primary"
        style="width: 50%; margin-bottom:30px;"
        @click.native.prevent="goToRegister"
      >注册</el-button>
      </div>
    </el-form>
    
    <div class="info" style="bottom: 40px;">Beta: 1.0</div>
    <div class="info">Technical Support: XXX</div>
  </div>
</template>

<script>

import { login } from "@/api/login"
import { setToken, setRole } from '@/utils/auth'

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        roleCode: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: '请输入手机号/邮箱' }
        ],
        password: [
          { required: true, trigger: "blur", message: '请输入密码' }
        ],
        roleCode: [
          { required: true, trigger: "blur", message: '请选择角色' }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {

      //数据格式验证
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // localStorage.setItem("hasLogin", true);
          
          login(this.loginForm).then(res => {
            this.loading = false;
            const token = "Bearer " + res.data.token
            // 设置token
            setToken(token)
            setRole(res.data.roleList)
    
            this.$router.push(this.$route.query.redirect || '/index');
          })

         
         
        } else {
          
        }
      });
      return 0;
    },

    goToRegister() {
      this.$router.push({
        path: "/register"
      })
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.info {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: gainsboro;
}
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .btn-line {
    display: flex;
    justify-content: space-around;
  }
}
</style>
