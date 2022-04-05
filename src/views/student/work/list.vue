<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :rules="queryRules" :inline="true">
      <el-form-item prop="courseId" label="课程：">
        <el-select v-model="queryParam.courseId"  clearable >
          <el-option v-for="course in courseList" 
            :key="course.courseId" :value="course.courseId" :label="course.courseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="lessonId" label="课时ID" width="120px"/>
      <el-table-column prop="lessonName" label="课时" width="120px"/>
      <el-table-column prop="learningTitle" label="作业标题"  />
      <el-table-column prop="finish" label="状态">
        <template slot-scope="{row}">
          <el-tag v-if="row.finish === 'FINISHED'" type="success">完成</el-tag>
          <el-tag v-if="row.finish === 'UNFINISHED'" type="danger">待做</el-tag>
          <el-tag v-if="row.finish === 'OVERTIME'" type="warning">超时完成</el-tag>
          <el-tag v-if="Date.parse(row.limitDate) < new Date()" type="danger">已截止</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="布置时间" width="160px"/>
      <el-table-column prop="limitDate" label="截止时间"  width="160px"/>
      <el-table-column  label="操作" align="center"  width="260px">
        <template slot-scope="{row}">
          <el-button v-if="row.finish === 'UNFINISHED'"  @click="doWork(row.learningTitle)" >去做</el-button>
          <el-button v-if="row.finish !== 'UNFINISHED'"   @click="doWork(row.learningTitle)" >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="sizes, prev, pager, next"
      :current-page.sync="queryParam.pageNum"
      :total="totalElements"
      :page-size="queryParam.pageSize"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="pageChange"
      @prev-click="pageChange"
      @next-click="pageChange"
    ></el-pagination>

  <!-- 弹出层 -->
    <el-dialog :visible.sync="updatePage.showDialog"  width="70%">
      <el-form :inline="true">
        <el-form-item label="截止时间：" prop="limitDate">
          <el-date-picker type="datetime" v-model="updatePage.limitDate" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="截止日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateLimitDate">确 定</el-button>
          <el-button @click="updatePage.showDialog = false">取 消</el-button>
     </span>
    </el-dialog>

  </div>
</template>

<script>
import { getMyTeachesCourse,  getLearningListByStudent, updateLearningLimitDate, getStudentCourses } from '@/api/course'

export default {
  data () {
    return {
      queryParam: {
        courseId: '',
        pageNum: 1,
        pageSize: 6
      },
      pageSizes: [6, 7, 8, 9, 10],
      courseList: [],
      listLoading: false,
      tableData: [],
      totalElements: 0,
      switchPage: false,
      updatePage: {
        showDialog: false,
        limitDate: '',
        learningTitle: '',
      },
      learningShow: {
        showDialog: false,
      },
      questionItems: [],

      queryRules: {
        courseId: [
          { required: true, message: '请选择课程', trigger: 'blur' }
        ]
      },

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
    this.getCourseList()
  },
  methods: {

    //分页大小
    handleSizeChange(val) {
      this.queryParam.pageSize = val
      this.queryParam.pageNum = 1
    },

    pageChange(page) {
      this.switchPage = true
      this.search(page);
    },

    // 更新截止日期
    update(learningTitle) {
      this.updatePage.showDialog = true
      this.updatePage.learningTitle = learningTitle
    },

    // 跳转做作业页面
    doWork(title) {
      let url = '/work/do'
      this.$router.push({ path: url, query: { title: title} })
    },

    updateLimitDate() {
      updateLearningLimitDate(this.updatePage.limitDate, this.updatePage.learningTitle).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '更新成功~'
          })
          this.switchPage = true
          this.search()
        }
      })
    },
    // 预览作业
    showLearning (row) {
      this.learningShow.showDialog = true
      console.log(row);
      this.req({
        url: `/api/course/v1/question/findByLeaningTitle?learningTitle=${row.learningTitle}`,
        method: 'GET'
      }).then(res => {
        if (res.code === 200) {
          console.log(res.data);
          this.questionItems = res.data
        }
       })
      // //this.questionShow.loading = true
      // this.learningShow.question = 
      // this.learningShow.questionType = row.questionType
    },

    // 获取课程列表
    getCourseList() {
      let objList = []
      getStudentCourses().then(res => {
        objList = res.data
        // 转换数据键值对名称
        objList.forEach((courseItem, index) => {
          const courseObj = { courseId: courseItem.courseId, courseName: courseItem.courseName }
          this.courseList.push(courseObj)
        })
      })
    },

    submitForm () {
      this.queryParam.pageIndex = 1
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.search()
        }
      })
      
    },
    search () {
      this.listLoading = true
      getLearningListByStudent(this.queryParam).then(res => {
        if (!this.switchPage) {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '查询成功~'
            })
          }
        }
        this.switchPage = false
        this.listLoading = false
        this.tableData = res.data.data
        this.totalElements = res.data.totalElements
      })
    },
  },
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