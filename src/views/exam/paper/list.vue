<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="课程：" >
        <el-select v-model="queryParam.courseId"  clearable>
          <el-option v-for="course in courseList" 
            :key="course.courseId" :value="course.courseId" :label="course.courseName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="lessonId" label="课时ID" width="140px"/>
      <el-table-column prop="lessonName" label="课时" width="140px"/>
      <el-table-column prop="learningTitle" label="作业标题"  width="360px"/>
      <el-table-column prop="createDate" label="布置时间" width="180px"/>
      <el-table-column prop="limitDate" label="截止时间"  width="180px"/>
      <el-table-column  label="操作" align="center"  >
        <template slot-scope="{row}">
          <el-button size="mini" @click="update(row.learningTitle)" >更新</el-button>
          <el-button size="mini" @click="showLearning(row)" >预览</el-button>
          <el-button size="mini" @click="detail(row)" >详情</el-button>
          <el-button size="mini" type="danger"  @click="deletePaper(row)" class="link-left">删除</el-button>
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

    <el-dialog :visible.sync="learningShow.showDialog" style="width: 100%;height: 100%">
      <el-form>
          <el-card class="exampaper-item-box" v-if="questionItems.length!==0">
            <el-form-item :key="questionItem.questionId" :label="index + 1 +'.'"
                          v-for="(questionItem, index) in questionItems"
                          class="exam-question-item"  label-width="50px">
             <QuestionShow :questionType="questionItem.questionType" :question="questionItem"/>
            </el-form-item>
          </el-card>
      </el-form>
          <span slot="footer" class="dialog-footer">
                <el-button @click="learningShow.showDialog = false">取 消</el-button>
          </span>
     </el-dialog>

      <template v-if="detailShow">
        <div class="echarts-style">
          <div id="echarts-1">
          
          </div>
          <el-button type="primary" size="mini" 
              style="width:100px; text-algin: center"
              @click="showDetailTable"
              >查看详情
          </el-button>
        </div>
      </template>

      <el-dialog title="非按时完成学生名单" :visible.sync="detailTableShow" width="80%">
        <el-table :data="detailTableData" max-height="450">
          <el-table-column property="studentId" label="学号" width="150"></el-table-column>
          <el-table-column property="name" label="姓名" ></el-table-column>
          <el-table-column prop="status" label="状态"
            :filters="[{ text: '未完成', value: 'UNFINISHED' }, { text: '超时', value: 'OVERTIME' }]"
            :filter-method="filterStatus"
            filter-placement="bottom-end"
          >
            <template slot-scope="{row}">
              <el-tag v-if="row.status === 'UNFINISHED'" type="danger">未完成</el-tag>
              <el-tag v-if="row.status === 'OVERTIME'" type="warning">超时完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column property="finishDate" label="完成时间"></el-table-column>
        </el-table>
      </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import QuestionShow from '../question/components/Show'
import { getMyTeachesCourse,  getLearningList, updateLearningLimitDate, getStudyNum, getStudyDetail } from '@/api/course'

export default {
  components: { QuestionShow },
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
      detailShow: false,
      detailTable: {
        learningTitle: '',
        courseId: ''
      },
      detailTableData: [],
      detailTableShow: false,
      questionItems: [],

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
  mounted() {
    
  },
  methods: {

    // 未完成作业详情
    showDetailTable() {
      
      getStudyDetail(this.detailTable.courseId, this.detailTable.learningTitle).then(res => {
        if (res.code === 200) {
          if (res.data.length > 0) {
            this.detailTableData = res.data
            this.detailTableShow = true
          } else {
            this.$message({
              type: 'success',
              message: '所有同学都按时完成了作业~'
            })
          }
        }
      })
    },

    // 查看作业完成详情
    detail(row) {
      this.detailShow = true
      this.detailTable.courseId = row.courseId
      this.detailTable.learningTitle = row.learningTitle
      let studyNumArr = []
      getStudyNum(row.courseId, row.learningTitle).then(res => {
        if (res.code === 200) {
          studyNumArr.push({value: res.data.overTime, name: '超时完成人数'})
          studyNumArr.push({value: res.data.unFinished, name: '未完成人数'})
          studyNumArr.push({value: res.data.finished, name: '完成人数'})

          this.onInitEchart(studyNumArr)
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      
    },

    // 表格过滤
    filterStatus(value, row) {
        return row.status === value;
    },

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
      getMyTeachesCourse().then(res => {
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
      this.search()
    },
    search () {
      this.listLoading = true
      getLearningList(this.queryParam).then(res => {
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

    onInitEchart(studyNumArr) {
      let myChart = echarts.init(document.getElementById('echarts-1'), 'walden')
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              position: 'outer',
              formatter: '{b}\n{c}人',
              color: '#0078F',
              fontSize: 12,
              lineHeight: 22
            },
            emphasis: {
              label: {
                show: true
              }
            },
            labelLine: {
              show: true
            },
            data: [
              {value: studyNumArr[0].value, name: studyNumArr[0].name},
              {value: studyNumArr[1].value, name: studyNumArr[1].name},
              {value: studyNumArr[2].value, name: studyNumArr[2].name},
            ]
          }
        ]
      }
      myChart.setOption(option)
      console.log(option);
    }

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

.echarts-style {
  display: flex;
  flex-flow: column;
  align-items: center; 
}

#echarts-1 {
        height: 350px;
        width: 800px;
        margin: 0 auto;
    }

</style>