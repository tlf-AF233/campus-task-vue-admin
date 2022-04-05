<template>
  <div class="root">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="100px" style="width:600px">
          <el-form-item label="课程名称">
            <el-input v-model="form.courseName"></el-input>
          </el-form-item>
          
          <el-form-item label="课程ID">
            <el-input v-model="form.courseId"></el-input>
          </el-form-item>

          <el-form-item label="学院/老师">
            <el-cascader
                style=" width: 50%"
                v-model="form.collegeTeacher"
                placeholder="请选择学院和老师"
                :options="collegeTeacherList"
                :props="{ checkStrictly: true }"
                clearable></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addCourse">添加</el-button>
          </el-form-item>
          
          
        </el-form>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>

import { getCollegeTeacherInfo } from '@/api/user'

export default {
  data() {
    return {
      collegeTeacherList: [],
      form: {
        courseName: '',
        courseId: '',
        collegeTeacher: ''
      }
    };
  },
  created: function() {
    this.getCollegeList()
  },
  methods: {

    // 获取学院列表
    getCollegeList() {
      getCollegeTeacherInfo().then(res => {
        res.data.forEach((collegeItem, index) => {
          const collegeObj = { value: collegeItem.collegeId, label: collegeItem.name, children: [] }
          this.collegeTeacherList.push(collegeObj)

          collegeItem.teacherList.forEach((teacherItem, teacherIndex) => {
            const teacherObj = { value: [teacherItem.id, teacherItem.name], label: teacherItem.name }
            this.collegeTeacherList[index].children[teacherIndex] = teacherObj
          })
        })
      })
    },

    
    // 添加课程
    addCourse() {
      let that = this;
      this.req({
        url: "/api/course/v1/course/add",
        data: {
          courseId: that.form.courseId,
          courseName: that.form.courseName,
          courseTeacherId: that.form.collegeTeacher[1][0],
          courseTeacher: that.form.collegeTeacher[1][1],
          collegeId: that.form.collegeTeacher[0]
        },
        method: "POST"
      }).then(
        res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功~'
            })
          }
        },
        err => {
          console.log("err :", err);
        }
      );
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