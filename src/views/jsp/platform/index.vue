<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="68px"
             style="display: flex;justify-content: space-between;">
      <el-form-item label="标题"
                    prop="testTitle">
        <el-select v-model="value1"
                   placeholder="请选择试验套题">
          <el-option v-for="(item,index) in typeCode"
                     :key="index"
                     :label="item.testTitle"
                     :value="item.testId">
          </el-option>
        </el-select>
        <el-button type="primary"
                   size="mini"
                   style="margin-left: 30px"
                   @click="()=>this.$message.success('选择成功')">确定</el-button>
      </el-form-item>

      <el-form-item>
        <div style="display: flex;justify-content: flex-end;">
          <el-button type="success"
                     circle
                     icon="el-icon-finished"
                     size="mini"
                     @click="download('hh.jsp', values)"
                     style="margin-right: 30px"></el-button>
          <el-upload class="upload-demo"
                     action="http://127.0.0.1:8081/public/upload"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :before-remove="beforeRemove"
                     :on-success="success"
                     multiple
                     :limit="3"
                     :on-exceed="handleExceed"
                     :file-list="fileList">
            <el-button size="small"
                       type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>

    <div class="echart-pie-wrap">
      <editor ref="myEditor"
              @init="editorInit"
              :value="value"
              :lang="tstuckPoint"
              theme="monokai"
              :options="options">
      </editor>
    </div>

  </div>

</template>

<script>
import { listTest } from "@/api/jsp/test";
import { listSave, getSave, delSave, addSave, updateSave } from "@/api/jsp/save";
import Editor from 'vue2-ace-editor'
// 主题
import 'brace/theme/monokai'
// 代码片段
import 'brace/snippets/javascript'
import 'brace/snippets/dockerfile'
import 'brace/snippets/python'
import 'brace/snippets/php'
import 'brace/snippets/html'
import 'brace/snippets/css'
import 'brace/snippets/ruby'
import 'brace/snippets/java'
import 'brace/snippets/jsp'
// 代码语言
import 'brace/mode/javascript'
import 'brace/mode/dockerfile'
import 'brace/mode/python'
import 'brace/mode/php'
import 'brace/mode/html'
import 'brace/mode/ruby'
import 'brace/mode/css'
import 'brace/mode/java'
import 'brace/mode/jsp'
// 语言扩展
import 'brace/ext/language_tools'
import 'brace/ext/emmet'
import 'brace/ext/beautify'
import 'brace/ext/searchbox'
import 'brace/ext/chromevox'
import 'brace/ext/error_marker'
import 'brace/ext/keybinding_menu'
import 'brace/ext/linking'
import 'brace/ext/modelist'
import 'brace/ext/old_ie'
import 'brace/ext/settings_menu'
import 'brace/ext/spellcheck'
import 'brace/ext/split'
import 'brace/ext/static_highlight'
import 'brace/ext/statusbar'
import 'brace/ext/whitespace'
import 'brace/ext/textarea'
import 'brace/ext/themelist'

export default {
  name: "Test",
  data () {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 试验管理表格数据
      testList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        testTitle: null,
        testSubtitle: null,
        testValue: null,
        testCreatetime: null,
        testRemark: null,
        userName: localStorage.getItem('online')
      },
      saveParams: {
        saveWithuser: null,
        savePath: null,
        saveScore: null,
        saveCreatetime: null,
        saveRemark: null,
        withTest: null,
        userName: localStorage.getItem('online')
      },
      //记录params
      param: {
        saveWithuser: null,
        savePath: null,
        saveScore: null,
        saveCreatetime: null,
        saveRemark: null,
        withTest: this.value1,
        userName: localStorage.getItem('online')
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      content: '',
      list: [
        {
          id: 0,
          value: 'java'
        },
        {
          id: 1,
          value: 'javascript'
        },
        {
          id: 2,
          value: 'c'
        },
        {
          id: 3,
          value: 'jsp'
        }
      ],

      options: {
        enableBasicAutocompletion: true, // 启用基本自动完成
        enableSnippets: true, // 启用代码段
        enableLiveAutocompletion: true, // 启用实时自动完成
        printMarginColumn: 30,
        displayIndentGuides: false, // 显示参考线
        enableEmmet: true, // 启用Emmet
        tabSize: 6, // 标签大小
        fontSize: 14, // 设置字号
        useWorker: true, // 使用辅助对象
        showPrintMargin: false, // 去除编辑器里的竖线
        enableMultiselect: true, //     选中多处
        readOnly: false, // 是否只读
        showFoldWidgets: true, // 显示折叠部件
        fadeFoldWidgets: true, // 淡入折叠部件
        wrap: true // 换行
      },
      txt: '',
      tstuckPoint: this.language.slice(),
      values: '',
      filePath: '',
      fileName: '',
      // 语言的种类
      typeCode: [],
      value1: '',
      fileList: []
    }
  }
  ,
  watch: {
    language (n) {
      this.tstuckPoint = n
    }
  },

  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    language: { type: String, default: 'jsp' }
  },

  model: {
    prop: 'value',
    event: 'change'
  },
  mounted () {
  },
  created () {
    this.queryParams.userName = localStorage.getItem('online')
    listTest(this.queryParams).then(res => {
      this.typeCode = res.rows
    })
  },
  methods: {
    success (value) {
      this.param.savePath = value.url
      addSave(this.param).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.open = false;
      });
    },
    editorInit: function (editor) {
      editor.getSession().on('change', val => {
        this.values = editor.getValue()
        this.$emit('change', editor.getValue())
      })
    },
    download (filename, text) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      localStorage.setItem('text', text)
      document.body.removeChild(element)
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
}


</script>
<style>
.c {
  width: 500px;
  height: 500px;
}

.echart-pie-wrap {
  width: 100%;
  height: 500px;
}

.myEditorTop {
  height: 45px;
  display: flex;
  align-items: center;
  background-color: #333;
  padding-left: 50px;
  color: rgb(241, 238, 8);
  font-weight: bold;
}
</style>
