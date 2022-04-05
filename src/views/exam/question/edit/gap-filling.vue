<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading"  :rules="rules">
      <el-form-item label="课程：" prop="courseId" required>
        <el-select v-model="form.courseId" placeholder="选择您的课程" clearable>
          <el-option v-for="course in courseList" :key="course.courseId" :value="course.courseId" :label="course.courseName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="题目编号：" prop="questionId" required>
        <el-input v-model="form.questionId" ></el-input>
      </el-form-item>
      
      <el-form-item label="题干：" prop="questionName" required>
        <el-input v-model="form.questionName"   @focus="inputClick(form,'questionName')" />
      </el-form-item>
      <el-form-item label="填空答案：" required>
        <el-form-item :label="item.prefix" :key="item.prefix"  v-for="item in form.items"  label-width="50px" class="question-item-label">
          <el-input v-model="item.content"   @focus="inputClick(item,'content')"  class="question-item-content-input"  style="width: 80%"/>
        </el-form-item>
      </el-form-item>
      <el-form-item label="解析：" prop="questionAnalysis" required>
        <el-input v-model="form.questionAnalysis"  @focus="inputClick(form,'questionAnalysis')" />
      </el-form-item>
      <el-form-item label="分数：" prop="score" required>
        <el-input-number v-model="form.score" :min="1" :max="10"></el-input-number>
      </el-form-item>
      <el-form-item label="难度：" required>
        <el-rate :max=3 :texts="['简单', '中等', '困难']" show-text v-model="form.difficulty" class="question-item-rate"></el-rate>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="showQuestion">预览</el-button>
      </el-form-item>
    </el-form>
    <el-dialog  :visible.sync="richEditor.dialogVisible"  append-to-body :close-on-click-modal="false" style="width: 100%;height: 100%"   :show-close="false" center>
      <Ueditor @ready="editorReady"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editorConfirm">确 定</el-button>
        <el-button @click="richEditor.dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
      <QuestionShow :questionType="questionShow.questionType" :question="questionShow.question" :qLoading="questionShow.loading"/>
    </el-dialog>
  </div>
</template>

<script>
import QuestionShow from '../components/Show'
import Ueditor from '@/components/Ueditor'
import { addQuestion, getMyTeachesCourse } from '@/api/course'


export default {
  components: {
    Ueditor, QuestionShow
  },
  data () {
    return {
      form: {
        questionId: '',
        questionType: 'gap',
        courseId: '',
        questionName: '',
        items: [],
        questionAnalysis: '',
        questionAnswer: '',
        score: '',
        difficulty: 0
      },
      formLoading: false,
      rules: {
        courseId: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ],
        questionName: [
          { required: true, message: '请输入题干', trigger: 'blur' }
        ],
        questionAnalysis: [
          { required: true, message: '请输入解析', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入分数', trigger: 'blur' }
        ],
        questionAnswer: [
          { required: true, message: '请选择正确答案', trigger: 'change' }
        ]
      },
      richEditor: {
        dialogVisible: false,
        object: null,
        parameterName: '',
        instance: null
      },
      questionShow: {
        questionType: 'gap',
        dialog: false,
        question: null,
        loading: false
      },
      courseList: []
    }
  },
  created () {
    this.getCourseList()
    let id = this.$route.query.questionId

    if (id) {
      this.req({
        url: `/api/course/v1/question/search?questionId=${id}`,
        method: 'GET'
      }).then(res => {
        this.form = res.data
        let difficulty = res.data.questionDifficulty
        if (difficulty === '简单') {
          this.form.difficulty = 1
        } else if (difficulty === '中等') {
          this.form.difficulty = 2
        } else if (difficulty === '困难') {
          this.form.difficulty = 3
        }
        
      })
    }
  },


  methods: {

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


    editorReady (instance) {
      this.richEditor.instance = instance
      let currentContent = this.richEditor.object[this.richEditor.parameterName]
      this.richEditor.instance.setContent(currentContent)
      // 光标定位到Ueditor
      this.richEditor.instance.focus(true)
    },
    inputClick (object, parameterName) {
      this.richEditor.object = object
      this.richEditor.parameterName = parameterName
      this.richEditor.dialogVisible = true
    },
    editorConfirm () {
      let content = this.richEditor.instance.getContent()
      if (this.richEditor.parameterName === 'questionName') { // 题干的正确答案重置
        if (this.questionItemReset(content)) {
          this.richEditor.object[this.richEditor.parameterName] = content
          this.richEditor.dialogVisible = false
        } else {

        }
      } else {
        this.richEditor.object[this.richEditor.parameterName] = content
        this.richEditor.dialogVisible = false
      }
    },
    questionItemReset (content) {
      let spanRegex = new RegExp('<span class="gapfilling-span (.*?)">(.*?)<\\/span>', 'g')
      let _this = this
      let newFormItem = []
      let gapfillingItems = content.match(spanRegex)
      if (gapfillingItems === null) {
        this.$message.error('请插入填空')
        return false
      }
      gapfillingItems.forEach(function (span, index) {
        let pairRegex = /<span class="gapfilling-span (.*?)">(.*?)<\/span>/
        pairRegex.test(span)
        newFormItem.push({ id: null, itemUuid: RegExp.$1, prefix: RegExp.$2, content: '' })
      })

      newFormItem.forEach(function (item) {
        _this.form.items.some((oldItem, index) => {
          if (oldItem.itemUuid === item.itemUuid) {
            item.content = oldItem.content
            item.id = oldItem.id
            return true
          }
        })
      })
      _this.form.items = newFormItem
      return true
    },
    submitForm () {
      console.log(this.form);
      // let _this = this
      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      //     this.formLoading = true
      //     questionApi.edit(this.form).then(re => {
      //       if (re.code === 1) {
      //         _this.$message.success(re.message)
      //         _this.delCurrentView(_this).then(() => {
      //           _this.$router.push('/exam/question/list')
      //         })
      //       } else {
      //         _this.$message.error(re.message)
      //         this.formLoading = false
      //       }
      //     }).catch(e => {
      //       this.formLoading = false
      //     })
      //   } else {
      //     return false
      //   }
      // })
    },
    showQuestion () {
      this.questionShow.dialog = true
      this.questionShow.questionType = this.form.questionType
      this.questionShow.question = this.form
    },
    resetForm () {
      let lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        questionId: '',
        questionType: 'gap',
        courseId: '',
        questionName: '',
        items: [],
        questionAnalysis: '',
        questionAnswer: '',
        score: '',
        difficult: 0
      }
    },
  },
}
</script>

<style scoped>
.question-item-label {
  margin-top: 10px;
  margin-bottom: 10px !important;
}

.question-item-remove {
  margin-left: 20px;
}

.question-item-content-input {
  margin-left: 8px;
  width: 60%;
}

.question-item-span {
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-left: 10px;
}

.question-item-rate {
  line-height: 2.5;
}
</style>