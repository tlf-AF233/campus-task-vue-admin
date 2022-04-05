<template>
  <div class="login-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">学生注册</h3>
      </div>

      <el-form-item prop="name">
        <el-input
          ref="name"
          v-model="registerForm.name"
          placeholder="请输入真实姓名"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="email">
        <el-input
          ref="email"
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="phone">
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="请输入手机号码"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="sex" class="btn-line">
        <el-radio-group v-model="registerForm.sex">
          <el-radio :label=1>男</el-radio>
          <el-radio :label=2>女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="studentId">
        <el-input
          ref="stuedntId"
          v-model="registerForm.studentId"
          placeholder="请输入学号"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="collegeMajor">
        <el-cascader v-model="registerForm.collegeMajor" :options="collegeMajorList" clearable placeholder="选择学院专业" style="width: 100%"></el-cascader>
      </el-form-item>

      

       <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          show-password
        />
      </el-form-item>

       <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          placeholder="请确认密码"
          name="confirmPassword"
          tabindex="2"
          auto-complete="on"
          show-password
        />
      </el-form-item>
      
      <el-divider></el-divider>
      
      <el-button
        id="register_btn"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >注册</el-button>
    </el-form>
    
  </div>
</template>

<script>

import { getCollegeInfo, registerUser } from "@/api/user"

export default {
  name: "Register",
  data() {
    let validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请再次输入密码"))
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次密码不一致"))
      } else {
        callback()
      }
    }

    let validatePhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
    }

    let validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入中文名'))
      } else {
        const reg = /^[\u4e00-\u9fa5]+$/
        if (value.length > 1 && reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的中文名'))
        }
      }
    }

    return {
      registerForm: {
        email: "",
        phone: "",
        name: "",
        studentId: "",
        collegeMajor: "",
        sex: "",
        password: "",
        confirmPassword: "",
        roleIdList: [2]
      },
      registerRules: {
        phone: [
          { validator: validatePhone, trigger: "blur" },
        ],
        name: [
          { validator: validateName, trigger: "blur" }
        ],
        studentId: [
          { min: 13, max: 13, trigger: "blur", message: "学号长度必须为13位" },
          { required: true, trigger: "blur", message: "请输入学号" }
        ],
        email: [
          { type: 'email', trigger: 'blur', message: '邮箱格式有误' },
          { required: true, trigger: 'blur', message: '请输入邮箱' },
        ],
        password: [
          { required: true, trigger: "blur", message: '请输入密码' },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        sex: [
          { required: true, trigger: "blur", message: '请选择性别' }
        ],
        collegeMajor: [
          { required: true, trigger: "blur", message: '请选择专业信息' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: "blur" }
        ]
      },
      loading: false,
      collegeMajorList: []
    };
  },
  methods: {
    handleRegister() {

      //数据格式验证
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          registerUser(this.registerForm).then(res => {
            this.loading = false;
            if (res.code === 200) {
              this.$router.push('/login');
            }
          })
        } else {
          
        }
      });
      return 0;
    },


    // 获取学院信息
    getCollegeList() {
      let objList = []
      getCollegeInfo().then(res => {
        objList = res.data
        // 转换数据键值对名称
        objList.forEach((collegeItem, index) => {
          const collegeObj = { value: collegeItem.collegeId, label: collegeItem.name, children: [] }
          this.collegeMajorList.push(collegeObj)
      
          collegeItem.majorVoList.forEach((majorItem, majorIndex) => {
            const majorClassInfo = majorItem.grade + "级" + majorItem.majorName + majorItem.classNo + "班"
            const majorObj = { value: majorItem.id, label: majorClassInfo }
            this.collegeMajorList[index].children[majorIndex] = majorObj
          })
        })
      })
    }
  },

  mounted() {
    this.getCollegeList()
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

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
    padding: 30px 35px 0;
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


  .btn-line {
    display: flex;
    justify-content: space-around;
  }
}
</style>
