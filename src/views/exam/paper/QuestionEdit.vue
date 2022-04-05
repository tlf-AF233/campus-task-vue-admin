<template>
  <div style="line-height:1.8">
    <div v-if="questionType=='choice'" v-loading="qLoading">
      <div class="q-title" v-html="question.questionName"/>
      <div class="q-content">
        <el-radio-group v-if="!question.finish" :disabled="isSubmit" v-model="answer.content" @change="answer.completed = true" >
          <el-radio  v-for="item in question.items"  :key="item.prefix"  :label="item.prefix" >
            <span class="question-prefix">{{item.prefix}}.</span>
            <span v-html="item.content" class="q-item-span-content"></span>
          </el-radio>
        </el-radio-group>
        <el-radio-group v-if="question.finish" disabled v-model="question.submitContent" >
          <el-radio  v-for="item in question.items"  :key="item.prefix"  :label="item.prefix" >
            <span class="question-prefix">{{item.prefix}}.</span>
            <span v-html="item.content" class="q-item-span-content"></span>
          </el-radio>
        </el-radio-group>
      </div>
     
    </div>

    <div v-if="questionType == 'code'" v-loading="qLoading">
      <div class="q-title" v-html="question.questionName"/>
      <div class="q-content">
        <CodeEditor :code="question.submitContent" v-if="question.finish"  />
        <CodeEditor v-if="!question.finish" ref="codeEd"/>
      </div>
     
    </div>
    <div v-else-if="qType==2" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
      <div class="q-content">
        <el-checkbox-group v-model="answer.contentArray" @change="answer.completed = true" >
          <el-checkbox v-for="item in question.items" :label="item.prefix" :key="item.prefix"  >
            <span class="question-prefix">{{item.prefix}}.</span>
            <span v-html="item.content" class="q-item-span-content"></span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div v-else-if="qType==3" v-loading="qLoading">
      <div class="q-title" v-html="question.title" style="display: inline;margin-right: 10px"/>
      <span style="padding-right: 10px;">(</span>
      <el-radio-group v-model="answer.content" @change="answer.completed = true" >
        <el-radio  v-for="item in question.items"  :key="item.prefix"  :label="item.prefix" >
          <span v-html="item.content" class="q-item-span-content"></span>
        </el-radio>
      </el-radio-group>
      <span style="padding-left: 10px;">)</span>
    </div>
    <div v-else-if="qType==4" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
      <div>
        <el-form-item :label="item.prefix" :key="item.prefix"  v-for="item in question.items"  label-width="50px" style="margin-top: 10px;margin-bottom: 10px;">
          <el-input v-model="answer.contentArray[item.prefix-1]"  @change="answer.completed = true" />
        </el-form-item>
      </div>
    </div>
    <div v-else-if="qType==5" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
      <div>
        <el-input v-model="answer.content" type="textarea" rows="5"  @change="answer.completed = true"/>
      </div>
    </div>
    <div v-else>
    </div>

    <template v-if="isSubmit || question.finish">
      <div class="question-answer-show-item" style="margin-top: 15px">
        <span class="question-show-item">结果：</span>
        <el-tag :type="tagType" v-if="isSubmit">
          {{ tagContent }}
        </el-tag>
        <el-tag :type="question.isPassed === 1 ? 'success' : 'danger'" v-if="question.finish">
          {{ question.isPassed === 1 ? '正确' : '错误' }}
        </el-tag>
      </div>
      <div class="question-answer-show-item">
        <span class="question-show-item">分数：</span>
        <span>{{question.score}}</span>
      </div>
      <div class="question-answer-show-item">
        <span class="question-show-item">难度：</span>
        <el-rate :max=3 disabled v-model="difficulty" class="question-show-item"></el-rate>
      </div>
      <br/>
      <div class="question-answer-show-item" style="line-height: 1.8">
        <span class="question-show-item">解析：</span>
        <span v-html="question.questionAnalysis" class="q-item-span-content" />
      </div>
      <div class="question-answer-show-item">
        <span v-if="questionType=='choice'" class="question-show-item">正确答案：</span>
        <span v-if="questionType=='choice'" v-html="question.questionAnswer" class="q-item-span-content"/>

        <span v-if="errorShow" class="question-show-item">错误提示：</span>
        <span v-if="errorShow" class="q-item-span-content">{{errmsg}}</span>
        <span v-if="qType==3" v-html="trueFalseFormatter(question)" class="q-item-span-content"/>
        <span v-if="qType==4">{{question.correctArray}}</span>
      </div>
    </template>
    <hr>
    <el-button v-if="question.questionType === 'choice'" :disabled="isSubmit || question.finish" size="mini" @click="submitQuestion" type="primary">提交</el-button>
    <el-button v-if="question.questionType === 'code'" v-loading="codeRunning" :disabled="isSubmit || question.finish" @click="submitCode" type="primary">提交运行</el-button>
  </div>

</template>

<script>
import CodeEditor from './codeEditor.vue'

export default {
  name: 'QuestionEdit',
  components: {CodeEditor},
  data() {
    return {
      isSubmit: false,
      tagType: 'success',
      tagContent: '正确',
      codeRunning: false,
      errorShow: false,
      errmsg: "",
    }
  },
  props: {
    question: {
      type: Object,
      default: function () {
        return {}
      }
    },
    answer: {
      type: Object,
      default: function () {
        return { id: null, content: '', contentArray: [] }
      }
    },
    qLoading: {
      type: Boolean,
      default: false
    },
    questionType: {
      type: String,
      default: 0
    }
  },
  computed: {
    difficulty() {
      if (this.question.questionDifficulty === '简单') {
        return 1
      } else if (this.question.questionDifficulty === '中等') {
        return 2
      } else if (this.question.questionDifficulty === '困难') {
        return 3
      }
    }
  },
  methods: {
    submitQuestion() {
      console.log(this.answer, this.question);
      if (this.answer.content === '') {
        return 
      }
      this.isSubmit = true
      let isPassed = 0
      if (this.answer.content !== this.question.questionAnswer) {
        this.tagType = 'danger'
        this.tagContent = '错误'
      } else {
        this.tagType = 'success'
        this.tagContent = '正确'
        isPassed = 1
      }

      this.req({
        url: '/api/course/v1/question/submit',
        method: 'POST',
        data: {
          learningId: this.question.learningId,
          isPassed: isPassed,
          courseId: this.question.courseId,
          score: this.question.score,
          submitContent: this.answer.content 
        }
      }).then(res => {
        if (res.code === 200) {

        }
      })
    },

    submitCode() {
      this.codeRunning = true
      this.question.submitContent = this.$refs.codeEd.getValue()
      console.log(this.question);

      this.req({
        url: '/api/course/v1/question/submitCode',
        method: 'POST',
        data: {
          learningId: this.question.learningId,
          courseId: this.question.courseId,
          submitContent: this.question.submitContent
        }
      }).then(res => {
        this.codeRunning = false
        if (res.code !== 200) {
          this.$message({
            type: 'error',
            message: '提交失败'
          })
        } else {
          this.isSubmit = true
          if (res.data.accept) {
            this.tagType = 'success'
            this.tagContent = '正确'
          } else {
            this.tagType = 'danger'
            this.tagContent = '错误'
            this.errorShow = true
          }
        }
        
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.q-title {
  margin: 0px 5px;

  p {
    display: inline !important;
  }
}


.q-content {
  p {
    display: inline !important;
  }
}

.q-item-prefix {
  margin: 5px 10px;
}

.q-item-contain {
  display: inline-block;
}

.q-item-content {
  margin: 5px;
  white-space: normal;

  p {
    display: inline !important;
  }
}

.gapfilling-span {
  color: red;
  padding: 0px 30px;
  margin: 0px 5px;
  border-bottom: 3px double red;
}


</style>