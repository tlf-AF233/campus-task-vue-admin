<template>
  <div class="json-editor" v-loading="loading">
    <textarea ref="textarea" ></textarea>
  </div>
</template>

<script>

import CodeMirror from 'codemirror'
// 核心样式
import 'codemirror/lib/codemirror.css'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/xq-light.css'
import 'codemirror/theme/darcula.css'

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
  // codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
  // 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
  // 如果有Java c++语言设置需求，需要 引入clike.js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'

import  'codemirror/addon/hint/show-hint.js'
import  'codemirror/addon/hint/show-hint.css'
// 设置光标所在行高亮工具包
import 'codemirror/addon/selection/active-line'


export default {
  name: 'CodeEditor',
  props: {
      value: {type: String,default: ''},
      config: {
          type:Object,default: () => {return {}}
      },
      theme: {
        type: String,
        default: 'darcula' // 高亮主题在import引入
      },
      code: {
        type: String,
        default:
              'import java.util.*; \n' +
              '// 统一以Main作为publc类名，请勿更改！\n' +
              'public class Main { \n' +
              '    public static void main(String[] args) { \n' +
              '        // 在这写代码哦~  \n'+
              '    } \n' +
              '} \n'
      }     
  },
  data () {
      return {
        loading: true,
        jsonEditor: false,
        // 支持切换的语法高亮类型，对应 JS 已经提前引入
        // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
        modeObx: {
              Text: 'text/plain',
              Java: 'text/x-java',
              Nodejs: 'javascript',
              CPlus: 'text/x-c++src'
        },
        editor: null,
        
      }
  },
  mounted () {
    console.log(this.jsonEditor);
    console.log(CodeMirror);
    console.log(this.editor);
    this.jsonEditor = this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
            mode:  "text/x-java",
            lineNumbers: true, // 行号
            lint: true,
            styleActiveLine: true, // 高亮光标所在行
            indentUnit: 4, // 缩进
            smartIndent: true, // 开启自动缩进
            tabSize: 4,
            theme:  this.theme,
            height: 20,
            matchBrackets: true,
            extraKeys: { "Alt-Enter": "autocomplete" }
    })
    this.editor.setSize('100%', '450px')
    this.editor.setValue(this.code)
    this.loading = false
       console.log(this.jsonEditor);
  },
  
  watch: {
        value(value){
              let editorValue = this.jsonEditor.getValue()
              if (value !== editorValue) {this.jsonEditor.setValue(value)}
        }
  },
  methods: {
      getValue () {
            return this.jsonEditor.getValue()
      },
      show() {
        console.log(this.getValue());
      }
  }

}
</script>

<style>
.json-editor {
    position: relative
  }
  .json-editor >>> .CodeMirror {
    height: 100%; min-height: 200px;
  }
  .json-editor >>> .CodeMirror-scroll {
      min-height: 200px;
  }
</style>