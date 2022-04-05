<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading" :rules="rules">
      <el-form-item label="课程：" prop="courseId" required :readonly="isUpdate">
        <el-select v-model="form.courseId" placeholder="选择您的课程" clearable>
          <el-option v-for="course in courseList" :key="course.courseId" :value="course.courseId" :label="course.courseName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="题目编号：" prop="questionId" required>
        <el-input v-model="form.questionId" :readonly="isUpdate"></el-input>
      </el-form-item>
      
      <el-form-item label="题干：" prop="questionName" required>
        <el-input v-model="form.questionName"   @focus="inputClick(form,'questionName')" />
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
      <el-form-item label="正确答案：" prop="questionAnswer" required>
        <el-input v-model="form.questionAnswer"  @focus="inputClick(form,'questionAnswer')" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="!isUpdate" type="primary" @click="submitForm">提交</el-button>
        <el-button v-if="isUpdate" type="primary" @click="updateForm">更新</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="success" @click="questionItemAdd">添加选项</el-button>
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
import { addQuestion, getMyTeachesCourse, updateQuestion } from '@/api/course'

export default {
  components: {
    Ueditor, QuestionShow
  },
  data () {
    return {
      form: {
        questionId: '',
        questionType: 'code',
        courseId: '',
        questionName: '',
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
          { required: true, message: '请填写正确答案', trigger: 'change' }
        ]
      },
      richEditor: {
        dialogVisible: false,
        object: null,
        parameterName: '',
        instance: null
      },
      questionShow: {
        questionType: '',
        dialog: false,
        question: null,
        loading: false
      },
      courseList: [],
      isUpdate: false
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
        this.isUpdate = true
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
      this.richEditor.object[this.richEditor.parameterName] = content
      this.richEditor.dialogVisible = false
    },
    questionItemRemove (index) {
      this.form.items.splice(index, 1)
    },
    questionItemAdd () {
      let items = this.form.items
      let newLastPrefix
      if (items.length > 0) {
        let last = items[items.length - 1]
        newLastPrefix = String.fromCharCode(last.prefix.charCodeAt() + 1)
      } else {
        newLastPrefix = 'A'
      }
      items.push({ id: null, prefix: newLastPrefix, content: '' })
    },
    submitForm () {
      
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          addQuestion(this.form).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
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

    updateForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          updateQuestion(this.form).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '更新成功'
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

    resetForm () {
      this.$refs['form'].resetFields()
      this.form = {
        questionId: '',
        questionType: 'choice',
        courseId: '',
        questionName: '',
        questionAnalysis: '',
        questionAnswer: '',
        score: '',
        difficult: 0
      }
    },
    showQuestion () {
      this.questionShow.dialog = true
      this.questionShow.questionType = this.form.questionType
      this.questionShow.question = this.form
    },
    
  },
  computed: {
    
  }
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