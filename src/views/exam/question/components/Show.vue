<template>
  <div style="line-height:1.8">
    <div v-if="questionType=='choice'" v-loading="qLoading">
      <div class="q-title" v-html="question.questionName"/>
      <div class="q-content">
          <span :key="index" v-for="(item,index) in question.items" class="q-item-contain">
            <span class="q-item-prefix">{{item.prefix}}</span>
            <span v-html="item.content" class="q-item-content"></span>
          </span>
      </div>
    </div>
    <div v-if="questionType == 'code'" v-loading="qLoading">
        <div class="q-title" v-html="question.questionName"/>
        <div class="q-content">
          <CodeEditor/>
        </div>
      </div>
    <div v-else-if="questionType==2" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
      <div class="q-content">
          <span :key="item.id" v-for="item in question.items" class="q-item-contain">
            <span class="q-item-prefix">{{item.prefix}}</span>
            <span v-html="item.content" class="q-item-content"></span>
          </span>
      </div>
    </div>
    <div v-else-if="questionType==3" v-loading="qLoading">
      <div class="q-title" v-html="question.title" style="display: inline;margin-right: 10px"/>
      <span>（</span>
      <span :key="item.id" v-for="item in question.items">
        <span v-html="item.content" class="q-item-content"></span>
       </span>
      <span>）</span>
    </div>
    <div v-else-if="questionType=='gap'" v-loading="qLoading">
      <div class="q-title" v-html="question.questionName"/>
    </div>
    <div v-else-if="questionType==5" v-loading="qLoading">
      <div class="q-title" v-html="question.title"/>
    </div>
    <div v-else>
    </div>
  </div>

</template>

<script>
import CodeEditor from '../../paper/codeEditor.vue'
export default {
  name: 'QuestionShow',
  components: {CodeEditor},
  props: {
    question: {
      type: Object,
      default: function () {
        return {}
      }
    },
    qLoading: {
      type: Boolean,
      default: false
    },
    questionType: {
      type: String,
      default: ''
    }
  },
  methods: {}
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