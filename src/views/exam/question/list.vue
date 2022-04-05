<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="题目ID：">
        <el-input v-model="queryParam.questionId" clearable></el-input>
      </el-form-item>
      <el-form-item label="课程：" >
        <el-select v-model="queryParam.courseId" placeholder="选择课程" clearable>
          <el-option v-for="item in courseList" :key="item.courseId" :value="item.courseId" :label="item.courseName"></el-option>
        </el-select>
      </el-form-item>
    
      <el-form-item label="题型：">
        <el-select v-model="queryParam.questionType" clearable>
          <el-option value="choice" label="选择题"></el-option>
          <el-option value="code" label="代码题"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="questionId" label="题目ID" width="90px"/>
      <el-table-column prop="questionType" label="题型" :formatter="questionTypeFormatter" width="70px"/>
      <el-table-column prop="questionName" label="题干" show-overflow-tooltip/>
      <el-table-column prop="score" label="分数" width="60px"/>
      <el-table-column prop="questionDifficulty" label="难度" width="60px"/>
      <el-table-column prop="createDate" label="创建时间" width="160px"/>
      <el-table-column label="操作" align="center" width="220px">
        <template slot-scope="{row}">
          <el-button size="mini"   @click="showQuestion(row)">预览</el-button>
          <el-button size="mini"  @click="editQuestion(row)">编辑</el-button>
          <el-button size="mini"  type="danger" @click="deleteQuestion(row)" class="link-left">删除</el-button>
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
    <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
      <QuestionShow :questionType="questionShow.questionType" :question="questionShow.question" :qLoading="questionShow.loading"/>
    </el-dialog>
  </div>
</template>

<script>
import QuestionShow from './components/Show'
import { getMyTeachesCourse, searchQuestion, deleteQuestion } from '@/api/course'

export default {
  components: { QuestionShow },
  data () {
    return {
      queryParam: {
        questionId: '',
        courseId: '',
        questionType: '',
        pageNum: 1,
        pageSize: 10
      },
      courseList: [],
      subjectFilter: null,
      listLoading: false,
      tableData: [],
      totalElements: 0,
      pageSizes: [10, 12, 15],
      questionShow: {
        questionType: '',
        dialog: false,
        question: null,
        loading: false
      },
      switchPage: false
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

    search () {
      this.listLoading = true
      searchQuestion(this.queryParam).then(res => {
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
        this.listLoading = false
        this.switchPage = false
        this.totalElements = res.data.totalElements
        this.tableData = res.data.data
      })

    },
    showQuestion (row) {
      this.questionShow.dialog = true
      console.log(row);
      //this.questionShow.loading = true
      this.questionShow.question = row
      this.questionShow.questionType = row.questionType
    },
    editQuestion (row) {
      let url = ''
      if (row.questionType === 'choice') {
        url = '/exam/question/edit/singleChoice'
      } else if (row.questionType === 'gap') {
        url = '/exam/question/edit/gapFilling'
      } else if (row.questionType === 'code') {
        url = '/exam/question/edit/code'
      }

      this.$router.push({ path: url, query: { questionId: row.questionId } })
    },

    // 删除
    deleteQuestion (row) {
      this.$confirm("此操作将删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteQuestion(row.questionId).then(res => {
          this.switchPage = true
          this.search()
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功~'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
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
  },
  
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.link-left {
  margin-left: 5px;
}
</style>