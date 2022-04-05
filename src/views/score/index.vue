<template>
  <div class="app-container">
    <el-form :model="courseId" ref="queryForm" :inline="true">
      <el-form-item label="课程：" >
        <el-select v-model="courseId"  clearable>
          <el-option v-for="course in courseList" 
            :key="course.courseId" :value="course.courseId" :label="course.courseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="tableData" :row-style="isGold" border fit highlight-current-row style="width: 100%">
       <el-table-column label="排名" type="index" width="100"> </el-table-column>
      <el-table-column prop="studentId" label="学号" width="140px"/>
      <el-table-column prop="name" label="姓名" width="140px"/>
      <el-table-column prop="score" label="分数"  width="360px"/>
    </el-table>
   
  </div>
</template>

<script>
import { getRole } from '@/utils/auth'
import { getMyTeachesCourse,  getStudentCourses, getTop10 } from '@/api/course'

export default {
  data () {
    return {
      courseList: [],
      listLoading: false,
      tableData: [],
      courseId: ''
    }

    
  },
  created () {
    
    
  },
  mounted() {
    this.getCourseList()
  },
  methods: {


    
    isGold({ row, rowIndex }) {
        
      
        if (rowIndex in [0, 1, 2]) {
          return {
            backgroundColor: 'gold',
          }
        }
        
    },



    // 获取课程列表
    getCourseList() {
      let objList = []
      let roleStr = getRole()
      let roles = roleStr.split(',')
      if (roles.includes('TEACHER')) {
        getMyTeachesCourse().then(res => {
          objList = res.data
          // 转换数据键值对名称
          objList.forEach((courseItem, index) => {
            const courseObj = { courseId: courseItem.courseId, courseName: courseItem.courseName }
            this.courseList.push(courseObj)
          })
        })
      } else if (roles.includes('STUDENT')) {
        getStudentCourses().then(res => {
          objList = res.data
          // 转换数据键值对名称
          objList.forEach((courseItem, index) => {
            const courseObj = { courseId: courseItem.courseId, courseName: courseItem.courseName }
            this.courseList.push(courseObj)
          })
        })
      }
    },

    submitForm () {
      this.listLoading = true
      getTop10(this.courseId).then(res => {
        
        if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '查询成功~'
            })
        }
        this.listLoading = false
        this.tableData = res.data
        console.log(this.tableData);
      })
    },

 

   }
}
</script>

<style scoped>
.exampaper-item-box {
  margin-top: 20px;
}

.exampaper-item {
  margin: 5px 0px;
}



</style>