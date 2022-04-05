<template>
  <div class="root">
    
    <div class="my-flex">
      <el-select
        style="padding-top: 10px; width: 50%"
        v-model="courseId"
        placeholder="请选择您所在的教学班"
        clearable>
        <el-option v-for="course in courseList" :key="course.courseId"
                   :label="course.courseName" :value="course.courseId" @blur="this.courseName = course.courseName"> 
        </el-option>  
      </el-select>

      <el-button @click="searchLesson" class="my-btn" type="primary">开始搜索</el-button>
      <el-button :disabled="this.courseId === ''" @click="dialogFormVisible = true" class="my-btn" type="primary">添加课时</el-button>
    
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
     
      <el-table-column prop="lessonId" label="课时编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lessonNumber" label="第几课时" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lessonName" label="课时" show-overflow-tooltip></el-table-column>
      
      <el-table-column label="操作">
        <div slot-scope="scope">
          <el-button @click="goToWork(scope.row.courseId, scope.row.lessonId, scope.row.lessonName)" size="small" type="primary" round>布置作业</el-button>
          <!-- <el-button
            @click="downloadFile(scope.row.name,scope.row.imgUrl)"
            size="small"
            type="primary"
            round
          >下载</el-button> -->
        </div>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="sizes, prev, pager, next"
      :current-page.sync="pageNum"
      :total="totalElements"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="pageChange"
      @prev-click="pageChange"
      @next-click="pageChange"
    ></el-pagination>
    <div class="footer-content" v-show="studentNumber !== undefined">教学班总人数为：{{ studentNumber }}</div>

    <el-dialog title="添加课时" :visible.sync="dialogFormVisible">
      <el-form ref="addLessonForm" :model="addLessonForm" :rules="rules">
        <el-form-item label="课时编号" prop="lessonId">
          <el-input v-model="addLessonForm.lessonId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时名" prop="lessonName">
          <el-input v-model="addLessonForm.lessonName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="第几课时" prop="lessonNumber">
          <el-input-number v-model="addLessonForm.lessonNumber" :min="1" autocomplete="off"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addLesson">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getMyTeachesCourse, getStudentNumber } from "@/api/course"

export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 6,
      pageSizes: [6, 7, 8, 9, 10],
      totalElements: 0, 
      tableData: [],
      courseSearchKey: "",
      courseList: [],
      courseId: '',
      courseName: '',
      studentNumber: undefined,
      operation: false,
      dialogFormVisible: false,
      addLessonButton: false,
      addLessonForm: {
        lessonId: '',
        lessonNumber: 1,
        lessonName: ''
      },

      rules: {
        lessonId: [
          { required: true, trigger: "blur", message: "请输入编号" }
        ],
        lessonNumber: [
          { required: true, trigger: "blur", message: "请输入课时号" }
        ],
        lessonName: [
          { required: true, trigger: "blur", message: "请输入名称" }
        ],

      },
    };
  },
  created: function() {
    this.getCourseList()
  },
  methods: {
    // 获取课程信息
    getCourseList() {
      let objList = []
      getMyTeachesCourse().then(res => {
        objList = res.data
        console.log(res);
        // 转换数据键值对名称
        objList.forEach((courseItem, index) => {
          const courseObj = { courseId: courseItem.courseId, courseName: courseItem.courseName }
          this.courseList.push(courseObj)
        })
      })
    },

    // 添加课时
    addLesson() {
      this.$refs.addLessonForm.validate(valid => {
        if (valid) {
          this.req({
            url: '/api/course/v1/lesson/add',
            method: 'POST',
            data: {
              lessonId: this.addLessonForm.lessonId,
              lessonNumber: this.addLessonForm.lessonNumber,
              lessonName: this.addLessonForm.lessonName,
              courseId: this.courseId
            },
            Headers
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            }
            this.operation = true
            this.searchLesson()
          })
        }
      })
    },

    //分页大小
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.operation = true
      this.searchLesson()
    },

   
    goToWork(courseId, lessonId, lessonName) {
      
      this.$router.push({path: '/exam/paper/edit', query: {courseId: courseId, lessonId: lessonId, lessonName: lessonName}})
        
    },
    // uploadSuccess(response, file, fileList) {
    //   let that = this;
    //   console.log(":", response);
    //   this.$message("上传成功~");
    //   this.$prompt("请输入素材名称", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消"
    //   })
    //     .then(({ value }) => {
    //       that
    //         .req({
    //           url: "addMaterial",
    //           data: {
    //             name: value,
    //             imgUrl: response.data,
    //             createDate: new Date().getTime()
    //           },
    //           method: "POST"
    //         })
    //         .then(
    //           res => {
    //             console.log("res :", res);
    //             that.getMaterialList();
    //           },
    //           err => {
    //             console.log("err :", err);
    //           }
    //         );
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "取消上传"
    //       });
    //     });
    // },
   
    // 下载文件

    pageChange(page) {
      this.operation = true
      this.searchLesson(page);
    },


    searchLesson() {
      getStudentNumber(this.courseId).then(res => {
        this.studentNumber = res.data
      })
      this.req({
        url: '/api/course/v1/lesson/listLessonByTeacher',
        data: {
          courseId: this.courseId,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        },
        Headers,
        method: "POST"
      }).then(
        res => {
          if (!this.operation) {
            if (res.data.length < 1) {
              this.$message({
                message: "查询无果~",
                type: 'success' 
              });
              return 0;
            } else {
              this.$message({
                message: "查询成功~",
                type: 'success' 
              });
            }
            
          }
          this.operation = false
          this.totalElements = res.data.totalElements;
          this.tableData = res.data.data;
        },
        err => {
          console.log("err :", err);
        }
      );
    }
  }
};
</script>

<style>

.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }


.search {
  width: 50%;
}
.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}

.footer-content {
  margin: 20px;
}

.my-btn {
  margin-top: 10px;
  margin-left: 20px;
}
</style>