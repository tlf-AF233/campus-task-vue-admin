<template>
  <div>
   <!-- <el-row  class="do-exam-title">
      <el-col :span="24">
        <span :key="item.itemOrder"  v-for="item in answer.answerItems">
             <el-tag :type="questionCompleted(item.completed)" class="do-exam-title-tag" @click="goAnchor('#question-'+item.itemOrder)">{{item.itemOrder}}</el-tag>
        </span>
        <span class="do-exam-time">
          <label>截止时间：</label>
          <label>{{formatSeconds(remainTime)}}</label>
        </span>
      </el-col>
    </el-row>
    <el-row  class="do-exam-title-hidden">
      <el-col :span="24">
        <span :key="item.itemOrder"  v-for="item in answer.answerItems">
             <el-tag  class="do-exam-title-tag" >{{item.itemOrder}}</el-tag>
        </span>
        <span class="do-exam-time">
          <label>剩余时间：</label>
        </span>
      </el-col>
    </el-row> -->
    <el-container  class="app-item-contain">
      <!-- <el-header class="align-center">
        <h1>{{form.name}}</h1>
        <div>
          <span class="question-title-padding">试卷总分：{{form.score}}</span>
          <span class="question-title-padding">考试时间：{{form.suggestTime}}分钟</span>
        </div>
      </el-header> -->
      <el-main>
        <el-form>
          <el-card class="exampaper-item-box" v-if="questionItems.length!==0">
            <el-form-item :key="questionItem.questionId" :label="index + 1 +'.'"
                          v-for="(questionItem, index) in questionItems"
                          class="exam-question-item"  label-width="50px">
             <QuestionEdit :questionType="questionItem.questionType" :question="questionItem"/>
            </el-form-item>
          </el-card>
           <el-row class="do-align-center">
             <el-button @click="backPage">返回</el-button>
           </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { } from '@/api/course'
import QuestionEdit from './QuestionEdit'

export default {
  components: { QuestionEdit },
  data () {
    return {
      form: {},
      formLoading: false,
      answer: {
        questionId: null,
        doTime: 0,
        answerItems: []
      },
      timer: null,
      remainTime: 0,
      questionItems: []
    }
  },
  created () {
    this.showLearning()
    let title = this.$route.query.title
    this.showLearning(title)
  },
  mounted () {

  },
  beforeDestroy () {
    window.clearInterval(this.timer)
  },


  methods: {

    // 预览作业
    showLearning (title) {
      this.req({
        url: `/api/course/v1/question/findByLeaningTitle?learningTitle=${title}`,
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

    questionCompleted (completed) {
      return this.enumFormat(this.doCompletedTag, completed)
    },
    goAnchor (selector) {
      this.$el.querySelector(selector).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
    },
    initAnswer () {
      this.answer.id = this.form.id
      let titleItemArray = this.form.titleItems
      for (let tIndex in titleItemArray) {
        let questionArray = titleItemArray[tIndex].questionItems
        for (let qIndex in questionArray) {
          let question = questionArray[qIndex]
          this.answer.answerItems.push({ questionId: question.id, content: null, contentArray: [], completed: false, itemOrder: question.itemOrder })
        }
      }
    },

    // 回退
    backPage() {
      this.$confirm('确定返回吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {
                  
        });
    },

    submitForm () {
      let _this = this
      window.clearInterval(_this.timer)
      _this.formLoading = true
      examPaperAnswerApi.answerSubmit(this.answer).then(re => {
        if (re.code === 1) {
          _this.$alert('试卷得分：' + re.response + '分', '考试结果', {
            confirmButtonText: '返回考试记录',
            callback: action => {
              _this.$router.push('/record/index')
            }
          })
        } else {
          _this.$message.error(re.message)
        }
        _this.formLoading = false
      }).catch(e => {
        _this.formLoading = false
      })
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      doCompletedTag: state => state.exam.question.answer.doCompletedTag
    })
  }
}
</script>

<style lang="scss" scoped>
  .align-center {
    text-align: center
  }

  .exam-question-item {
    padding: 10px;

    .el-form-item__label {
      font-size: 15px !important;
    }
  }

  .question-title-padding {
    padding-left: 25px;
    padding-right: 25px;
  }
</style>
