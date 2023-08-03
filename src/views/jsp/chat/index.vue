<template>
    <div class="app-container">

      <el-form ref="queryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="发表内容" prop="testTitle">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.chatChatvalue"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-chat-line-round" size="mini" @click="add()">发表</el-button>
        </el-form-item>
      </el-form>


      <el-row v-for="(item,index) in list" :key="index">
        <el-col :span="24">

          <div>
            <div style="float: left">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </div>
            <div style="float: left;margin-top: 10px;margin-left: 10px">
              {{item.chatUsertitle}}
            </div>
          </div>

          <div>
            <el-alert
              :title="item.chatChatvalue"
              type="info"
              :closable="false">
            </el-alert>
          </div>


        </el-col>
      </el-row>

    </div>
</template>

<script>
import axios from 'axios'
  export default {
        name: "index",
      data(){
        return{
          list:[],
          queryParams: {
            chatUsertitle: null,
            chatUserhead: null,
            chatChatvalue: null,
            chatCreatetime: null,
            chatRemark: null,
            userName:null
          },
        }
      },
    created() {
          this.queryParams.userName = localStorage.getItem('online')
      axios.get('http://127.0.0.1:8081/public/list').then(res=>{
        this.list = res.data.data
      })
    },
    methods:{
          add(){
            axios.post('http://127.0.0.1:8081/public/add',this.queryParams).then(res=>{
              this.$modal.msgSuccess("新增成功");
              axios.get('http://127.0.0.1:8081/public/list').then(res=>{
                this.list = res.data.data
              })
            })
      }

    }
    }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
