<template>
  <div class="root">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="form" :rules="registerRules" :model="form" label-width="100px" style="width:600px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label=1>男</el-radio>
              <el-radio :label=2>女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="角色" prop="roleIdList">
            <el-select v-model="form.roleIdList" 
                @change="changeRoleSelect"
                multiple placeholder="请选择角色">
              <el-option
                v-for="role in roleList"
                :key="role.id"
                :label="role.roleName"
                :value="role.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="学号" prop="studentId" v-show="isStudent">
            <el-input v-model="form.studentId"></el-input>
          </el-form-item>

          <el-form-item label="选择学院专业" prop="collegeMajor" v-show="isStudent">
            <el-cascader v-model="form.collegeMajor" 
              :options="collegeMajorList" clearable placeholder="选择学院专业" 
              style="width: 100%">
            </el-cascader>
          </el-form-item>

          <el-form-item label="选择学院" prop="college" v-show="isTeacher">
            <el-select v-model="form.collegeMajor"
                multiple placeholder="请选择学院">
              <el-option
                v-for="college in collegeList"
                :key="college.collegeId"
                :label="college.name"
                :value="college.collegeId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword" label="确认密码">
            <el-input
              v-model="form.confirmPassword"
              placeholder="请确认密码"
              name="confirmPassword"
              tabindex="2"
              auto-complete="on"
              show-password
            />
          </el-form-item>

          <el-button
              :loading="loading"
              type="primary"
              style="margin-left: 100px"
              @click.native.prevent="handleRegister"
            >注册</el-button>
        </el-form>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>

import { getCollegeInfo, getAllRoles, registerUser } from '@/api/user'

export default {
  data() {
    // 验证
    let validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请再次输入密码"))
      } else if (value !== this.form.password) {
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

    let validateStudentId = (rule, value, callback) => {
      if (!this.isStudent) {
        return callback()
      }
      if (!value) {
        callback(new Error('请输入学号'))
      } else {
        if (value.length === 13) {
          callback()
        } else {
          return callback(new Error('学号长度必须为13位'))
        }
      }
    }

    return {
      loading: false,
      isStudent: false,
      isTeacher: false,
      roleList: [],
      collegeList: [],
      collegeMajorList: [],
      form: {
        roleIdList: [],
        courseName: '',
        courseId: '',
        sex: '',
        password: '',
        name: '',
        collegeMajor: [],
        phone: '',
        email: '',
        confirmPassword: '',
        studentId: '',
      },
      registerRules: {
        roleIdList: [
          { required: true, trigger: "blur", message: "请选择角色" }
        ],
        phone: [
          { validator: validatePhone, trigger: "blur", required: true },
        ],
        name: [
          { validator: validateName, trigger: "blur", required: true }
        ],
        studentId: [
          { validator: validateStudentId, trigger: "blur" }
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
          { required: true, trigger: "blur", message: '请选择学院信息' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: "blur" }
        ]
      },
    };
  },
  created: function() {
    this.getRoleInfo()
    this.getCollegeList()
  },
  methods: {

    // 获取角色列表
    getRoleInfo() {
      getAllRoles().then(res => {
        res.data.forEach((item, index) => {
          const roleObj = { id: item.id, roleName: item.roleName }
          this.roleList.push(roleObj)
        })
      })
    },

    // 获取学院信息
    getCollegeList() {
      let objList = []
      getCollegeInfo().then(res => {
        objList = res.data
        // 转换数据键值对名称
        objList.forEach((collegeItem, index) => {
          const collegeParentObj = { value: collegeItem.collegeId, label: collegeItem.name, children: [] }
          this.collegeMajorList.push(collegeParentObj)
          
          const collegeObj = { collegeId: collegeItem.collegeId, name: collegeItem.name }
          this.collegeList.push(collegeObj)

          collegeItem.majorVoList.forEach((majorItem, majorIndex) => {
            const majorClassInfo = majorItem.grade + "级" + majorItem.majorName + majorItem.classNo + "班"
            const majorObj = { value: majorItem.id, label: majorClassInfo }
            this.collegeMajorList[index].children[majorIndex] = majorObj
          })
        })
      })
    },

    // 角色选择下拉框变化
    changeRoleSelect(value) {
      if (value.includes(2)) {
        this.roleList = []
        this.isStudent = true
        return
      }
      if (value.includes(1)) {
        this.isStudent = false
        this.isTeacher = true
        this.roleList.forEach((v, index) => {
          if (v.id === 2) {
            this.roleList.splice(index, 1)
          }
        })
        return
      }

      if (value.length === 0) {
        this.roleList = []
        this.isStudent = false
        this.isTeacher = false
        this.getRoleInfo()
        return
      }
    },
    // 注册
    handleRegister() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          registerUser(this.form).then(res => {
            this.loading = false;
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功~'
              })
            }
          })
        } else {
          
        }
      });
      return 0;
    },

  

  }
};
</script>

<style>

.line {
  text-align: center;
}

.box{
  width: 220px !important;
}
</style>