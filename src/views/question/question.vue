<template>
  <el-form :label-width="labelWidth">
    <el-form-item label="课程号">
      <el-input v-model.number="exercise.lessonNumber" style="width:300px;" placeholder="请输入课程序号" />
    </el-form-item>
    <el-form-item v-if="!isLessonPractice" label="题目排序权重">
      <el-input v-model.number="exercise.seq" style="width:300px;" placeholder="请输入题目排序权重值" />
      <span class="text-xs">当前题目在第{{ exercise.lessonNumber }}课下的排序权重值，越小越靠前</span>
    </el-form-item>

    <el-form-item v-if="!isBaseCourseContent" label="题目类型">
      <label>
        <el-checkbox v-model="showSortProblem" /> 排序题
      </label>
      <label style="margin-left: 20px">
        <el-checkbox v-model="showCodePractice" disabled /> 代码题
      </label>
    </el-form-item>
    <el-collapse v-model="questionType">
      <el-collapse-item v-if="showSortProblem" title="排序题" name="1">
        <sortProblemConfig :data="exercise.data.sortProblem" :label-width="labelWidth" />
      </el-collapse-item>
      <el-collapse-item title="代码题" name="2">
        <el-form-item label="题目标题">
          <el-input v-if="isLessonPractice" v-model="exercise.data.title" style="width:300px;" placeholder="请输入题目的标题" />
          <el-input v-else v-model="exercise.title" style="width:300px;" placeholder="请输入题目的标题" />
        </el-form-item>
        <el-form-item label="题目内容">
          <el-input v-model="exercise.data.content" :autosize="{ minRows: 4}" type="textarea" placeholder="请输入题目的内容" />
        </el-form-item>
        <el-form-item label="内容图片">
          <imageUpload v-model="exercise.data.content_img" />
        </el-form-item>
        <el-form-item label="题目答案">
          <el-input v-model="exercise.data.answer" :autosize="{ minRows: 4}" type="textarea" placeholder="请输入题目的答案" />
        </el-form-item>
        <el-form-item label="题目tips">
          <el-input
            v-model="exercise.data.tips"
            :autosize="{ minRows: 4}"
            type="textarea"
            placeholder="请输入题目的tips,用/区分"
          />
        </el-form-item>
        <template v-if="isBaseCourseContent">
          <el-form-item label="题目参考答案">
            <codeEditor v-model="exercise.data.reference_answer" />
          </el-form-item>
          <el-form-item v-if="Array.isArray(relationCards)" label="题目tips图片">
            <div
              v-for="(img, index) in relationCards"
              :key="index"
              class="image-option"
            >
              <el-input v-model="relationCards[index].title" class="image-option_input" />
              <imageUpload v-model="relationCards[index].img_url" @input="removeRelationCard(index)" />
            </div>
            <div class="image-option">
              <el-button @click="addRelationCard">
                增加一项
              </el-button>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="题目难度">
          <el-select v-model="exercise.difficulty" placeholder="选择难度">
            <el-option
              v-for="item in difficultOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <testCodeConfig v-if="!isBaseCourseContent" :is-exercise="true" :data="exercise.data" />
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script>

const difficultOptions = Object.freeze([
  { value: 1, label: '简单' },
  { value: 2, label: '中等' },
  { value: 3, label: '困难' },
  { value: 4, label: '💊 挑战' },
  { value: 5, label: '😈 地狱' }
])

const initWithRawExercise = (rawExercise, isLessonPractice) => {
  if (!isLessonPractice && rawExercise && (rawExercise.seq === null)) {
    rawExercise.seq = 1
  }
  const exercise = Object.assign({
    exerciseId: '',
    courseId: '',
    lessonId: '',
    lessonNumber: '',
    difficulty: '1',
    seq: 1,
    title: '',
    data: {
      title: '',
      content: '',
      content_img: '',
      answer: '',
      reference_answer: '',
      tips: '',
      tables: [],
      relation_cards: [],
      sortProblem: {
        title: '',
        list: []
      },
      test_cases: [],
      upload_file_list: [], // 需要上传的代码文件
      default_file: '',
      continuous_preview_file: true,
      resource_url: '',
      work_path: '/',
      mount_path: '',
      code: '',
      preset_code: '',
      timeout: 10,
      output_style: '',
      code_mode: ''
    }
  }, rawExercise)

  const exerciseData = isLessonPractice ? rawExercise : exercise
  const lastProblem = exerciseData.data.sortProblem
  return {
    exerciseData,
    lastProblem,
    showSortProblem: Array.isArray(lastProblem.list) && lastProblem.list.length > 0
  }
}

export default {
  name: 'question',
  props: {
    labelWidth: { type: String, default: '100px' },
    rawExercise: {
      type: Object,
      default: () => {
      }
    },
    isLessonPractice: { type: Boolean, default: false }
  },
  data() {
    const { exerciseData, lastProblem, showSortProblem } = initWithRawExercise(this.rawExercise, this.isLessonPractice)
    return {
      questionType: ['1', '2'],
      showSortProblem: showSortProblem,
      showCodePractice: true,
      exercise: exerciseData,
      difficultOptions,
      lastSortProblem: lastProblem
    }
  },
  computed: {
    relationCards() {
      return this.exercise.data.relation_cards
    },
    isBaseCourseContent() {
      return this.$store.getters['course/isBaseCourseContent']
    }
  },
  watch: {
    // 原始数据改变
    rawExercise() {
      const { exerciseData, lastProblem, showSortProblem } = initWithRawExercise(this.rawExercise, this.isLessonPractice)
      this.showSortProblem = showSortProblem
      this.exercise = exerciseData
      this.lastSortProblem = lastProblem
    },
    // 表单内容改变
    exercise: {
      handler(newValue) {
        this.$emit('input', newValue)
      },
      immediate: true
    },
    // 取消排序题的时候
    showSortProblem(newVal) {
      if (newVal) {
        this.questionType = ['1', '2']
        this.exercise.data.sortProblem = this.lastSortProblem
      } else {
        this.questionType = ['2']
        this.lastSortProblem = this.exercise.data.sortProblem
        this.exercise.data.sortProblem = {
          title: '',
          list: []
        }
      }
    }
  },
  methods: {
    removeRelationCard(index) {
      const config = this.relationCards[index]
      if (!config.img_url) {
        this.relationCards.splice(index, 1)
      }
    },
    addRelationCard() {
      this.relationCards.push({
        title: '',
        img_url: ''
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .exercise-header {
    /*text-align: center;*/
    margin-bottom: 20px;
  }
  .text-xs {
    font-size: 12px;
  }
  .image-option {
    float: left;
    margin: 5px;
    &_input {
      width: 150px;
      margin-bottom: 5px;
    }
  }
</style>
