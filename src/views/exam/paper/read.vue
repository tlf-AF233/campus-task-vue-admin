<template>
<div>

  <el-container  class="app-item-contain">
    <el-header class="align-center">
      <h1>{{form.name}}</h1>
      
    </el-header>
    <el-main>
     <el-form>
          <el-card class="exampaper-item-box" v-if="questionItems.length!==0">
            <el-form-item :key="questionItem.questionId" :label="index + 1 +'.'"
                          v-for="(questionItem, index) in questionItems"
                          class="exam-question-item"  label-width="50px">
             <QuestionAnswerShow :questionType="questionItem.questionType" :question="questionItem"/>
            </el-form-item>
          </el-card>
      </el-form>
    </el-main>
  </el-container>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import QuestionAnswerShow from './QuestionAnswerShow'
export default {
  components: { QuestionAnswerShow },
  data () {
    return {
      form: {},
      formLoading: false,
      answer: {
        id: null,
        score: 0,
        doTime: 0,
        answerItems: [],
        doRight: false
      }
    }
  },
  created () {
    let id = this.$route.query.id
    let _this = this
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      examPaperAnswerApi.read(id).then(re => {
        _this.form = re.response.paper
        _this.answer = re.response.answer
        _this.formLoading = false
      })
    }
  },
  methods: {
    formatSeconds (theTime) {
      return formatSeconds(theTime)
    },
    questionDoRightTag (status) {
      return this.enumFormat(this.doRightTag, status)
    },
    goAnchor (selector) {
      this.$el.querySelector(selector).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' })
    }
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      doRightTag: state => state.exam.question.answer.doRightTag
    })
  }
}
</script>

<style lang="scss" scoped>
  .align-center {
    text-align: center
  }

  .exam-question-item{
    padding: 10px;
    .el-form-item__label{
      font-size: 15px !important;
    }
  }

  .question-title-padding{
    padding-left: 25px;
    padding-right: 25px;
  }
  .do-exam-title {
  position: fixed;
  width: 100%;
  background: #fff6f6;
  z-index: 999;
  padding: 5px 0px;
}

.do-exam-title-hidden {
  width: 100%;
  visibility: hidden;
  padding: 5px 0px;
}

.do-exam-title-tag {
  margin-left: 5px;
  cursor: pointer;
}

.do-exam-time {
  float: right;
  line-height: 2;
  font-size: 14px;
  padding-right: 5px;
}

.do-align-center {
  text-align: center;
  margin-top: 40px;

  .el-form-item__content {
    margin-left: 0px !important;
  }
}

</style>
