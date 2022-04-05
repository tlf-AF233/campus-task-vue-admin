<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading" :rules="rules">
      <template v-if="!isRedirect">
        <el-form-item label="课程：" prop="courseId" required>
        <el-select v-model="form.courseId" placeholder="选择您的课程" clearable @blur="getLessonList">
          <el-option v-for="course in courseList" :key="course.courseId" :value="course.courseId" :label="course.courseName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="this.form.courseId != ''" label="课时：" prop="lessonId" required>
        <el-select v-model="form.lessonId" placeholder="选择课时" clearable>
          <el-option v-for="lesson in lessonList" :key="lesson.lessonId" :value="lesson.lessonId" :label="lesson.lessonName"></el-option>
        </el-select>
      </el-form-item>

      </template>
      
    <template v-if="isRedirect">
        <el-form-item label="课程：" prop="courseId" required v-show="false">
        <el-input v-model="form.courseId" readonly />
      </el-form-item>

      <el-form-item label="课时：" prop="lessonId" required>
        <el-input v-model="form.lessonId" readonly v-show="false"/>
        <el-input v-model="lessonName" readonly/>
      </el-form-item>
    </template>
    


      <el-form-item label="截止时间：" prop="limitDate" required>
        <el-date-picker type="datetime" v-model="form.limitDate" value-format="yyyy-MM-dd HH:mm:ss"
                       placeholder="截止日期" :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="作业标题："  prop="learningTitle" required>
        <el-input v-model="form.learningTitle"/>
      </el-form-item>
      
        <el-card class="exampaper-item-box" v-if="questionItems.length!==0">
          <el-form-item prop="questionIds" :key="item.questionId" :label="'题目'+(index+1)+'：'"
                        v-for="(item, index) in questionItems" style="margin-bottom: 15px">
            <el-row>
              <el-col :span="23">
                <QuestionShow :questionType="item.questionType" :question="item"/>
              </el-col>
              <el-col :span="1">
                <el-button type="text" size="mini" @click="questionItems.splice(index,1)">删除
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-card>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" :disabled="this.form.courseId === ''" @click="addQuestion">添加题目</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹出层 -->
    <el-dialog :visible.sync="questionPage.showDialog"  width="70%">
      <el-form :model="questionPage.queryParam" ref="queryForm" :inline="true">
        <el-form-item label="ID：">
          <el-input v-model="questionPage.queryParam.questionId"  clearable></el-input>
        </el-form-item>
        <el-form-item label="题型：">
          <el-select v-model="questionPage.queryParam.questionType" clearable>
            <el-option value="choice" label="选择题"></el-option>
            <el-option value="code" label="代码题"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryForm">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="questionPage.listLoading" :data="questionPage.tableData"
                 border fit highlight-current-row style="width: 100%">
        <el-table-column prop="questionId" label="编号" width="60px"/>
        <el-table-column prop="questionType" label="题型" :formatter="questionTypeFormatter" width="80px"/>
        <el-table-column prop="questionName" label="题干" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="80px">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="confirmQuestionSelect(row)">添 加</el-button>
          </template>
      </el-table-column>
      </el-table>
        <el-pagination
          class="pagination"
          background
          layout="sizes, prev, pager, next"
          :current-page.sync="questionPage.queryParam.pageNum"
          :total="questionPage.totalElements"
          :page-size="questionPage.queryParam.pageSize"
          :page-sizes="questionPage.pageSizes"
          @size-change="handleSizeChange"
          @current-change="pageChange"
          @prev-click="pageChange"
          @next-click="pageChange"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
          <el-button @click="questionPage.showDialog = false">取 消</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>

import QuestionShow from '../question/components/Show'
import { searchQuestion, getMyTeachesCourse, getLessons, addLearning } from '@/api/course'

export default {
  components: { QuestionShow },
  data () {
    return {
      isRedirect: false,
      form: {
        courseId: '',
        lessonId: '',
        limitDate: '',
        learningTitle: '',
        questionIds: []
      },
      courseName: '',
      lessonName: '',

      questionItems: [],

      formLoading: false,
      rules: {
        courseId: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ],
        lessonId: [
          { required: true, message: '请选择课时', trigger: 'change' }
        ],
        learningTitle: [
          { required: true, message: '请填写标题', trigger: 'change' }
        ],
        limitDate: [
          { required: true, message: '请选择截止时间', trigger: 'change' }
        ],
        questionIds: [
          { required: true, message: '请选择题目', trigger: 'change' }
        ],
      },


      questionPage: {
        showDialog: false,
        queryParam: {
          questionId: '',
          questionType: '',
          courseId: '',
          pageNum: 1,
          pageSize: 6
        },
        listLoading: true,
        tableData: [],
        totalElements: 0,
        pageSizes: [6, 7, 8, 9, 10]
      },
      courseList: [],
      lessonList: [],
      switchPage: false,

      pickerOptions: {
          disabledDate(time) {
            return time.getTime() < new Date().getTime()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }]
        },
    }
  },
  created () {
    
    let courseId = this.$route.query.courseId
    let lessonId = this.$route.query.lessonId
    let lessonName = this.$route.query.lessonName

    if (courseId != null && lessonId != null && lessonName != null) {
      this.isRedirect = true
      this.form.courseId = courseId
      this.form.lessonId = lessonId
      this.lessonName = lessonName
    } else {
      this.getCourseList()
    }
    
  },
  methods: {

    //分页大小
    handleSizeChange(val) {
      this.questionPage.queryParam.pageSize = val
      this.questionPage.queryParam.pageNum = 1
    },

    pageChange(page) {
      this.switchPage = true
      this.search(page);
    },

    // 获取课程列表
    getCourseList() {
      let objList = []
      getMyTeachesCourse().then(res => {
        objList = res.data
        // 转换数据键值对名称
        objList.forEach((courseItem, index) => {
          const courseObj = { courseId: courseItem.courseId, courseName: courseItem.courseName }
          this.courseList.push(courseObj)
        })
      })
    },

    // 获取课时列表
    getLessonList() {
      let objList = []
      getLessons(this.form.courseId).then(res => {
        objList = res.data
        // 转换数据键值对名称
        objList.forEach((lessonItem, index) => {
          const lessonObj = { lessonId: lessonItem.lessonId, lessonName: lessonItem.lessonName }
          this.lessonList.push(lessonObj)
        })
      })
    },


    submitForm () {
      
      this.$refs.form.validate((valid) => {
        console.log(this.form);
        if (valid) {
          this.formLoading = true
          addLearning(this.form).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功~'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
              
            }
            this.formLoading = false
          }).catch(e => {
            this.formLoading = false
          })
        } else {
          return false
        }
      })
    },

    addQuestion () {
      this.questionPage.showDialog = true
      this.search()
    },
    queryForm () {
      this.questionPage.queryParam.pageNum = 1
      this.search()
    },

    // 确认选择题目
    confirmQuestionSelect (row) {

      this.req({
        url: `/api/course/v1/question/search?questionId=${row.questionId}`,
        method: 'GET'
      }).then(res => {
        if (res.code === 200) {
          this.questionItems.push(res.data)
          this.form.questionIds.push(res.data.questionId)
        }
      })

      this.questionPage.showDialog = false
    },


    // 查询题目
    search () {
      this.questionPage.listLoading = true
      this.questionPage.queryParam.courseId = this.form.courseId
      searchQuestion(this.questionPage.queryParam).then(res => {
        if (!this.switchPage) {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '查询成功~'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }
        console.log(res.data);
        this.questionPage.listLoading = false
        this.switchPage = false
        this.questionPage.tableData = res.data.data
        this.questionPage.totalElements = res.data.totalElements
      })
    },

    questionTypeFormatter (row, column, cellValue, index) {
       if (cellValue === 'choice') {
        return '选择题'
      } else if (cellValue === 'code') {
        return '代码题'
      } else if (cellValue === 'gap') {
        return '填空题'
      } else {
        return '未知题'
      }
    },

    resetForm () {
      this.$refs['form'].resetFields()
      this.form = {
        courseId: '',
        lessonId: '',
        limitDate: '',
        learningTitle: '',
        questionIds: []
      }
      this.questionItems = []
      
    },
   
  },
 
}
</script>

<style lang="scss">
  .exampaper-item-box {
    .q-title {
      margin: 0px 5px 0px 5px;
    }
    .q-item-content {
    }
  }
  .app-container {
    padding: 20px;
  }

  .link-left {
    margin-left: 5px;
  }

  .exampaper-item-box {
    margin-top: 20px;
  }

  .exampaper-item {
    margin: 5px 0px;
  }

</style>
