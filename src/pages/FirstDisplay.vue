<template>
  <div class="crud">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :space="100" :active="active" style="float: right;">
          <el-step icon="edit" title="选取文件"></el-step>
          <el-step icon="upload" title="提交算法"></el-step>
          <el-step icon="picture" title="返回结果"></el-step>
          <el-step icon="information" title="详细参数"></el-step>
        </el-steps>
        <el-row>
          <el-col :span="6">
            <el-upload
              class="upload-demo"
              action="//jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
              :auto-upload="true">
              <el-button v-show="true" slot="trigger" size="small" type="primary" disabled>选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :loading="searching">提交任务</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
            </el-upload>
          </el-col>
        </el-row>
      </div>


      <el-row style="margin-top: 30px">
        <el-col :span="2">
          输入 ->
        </el-col>
        <el-col :span="22">
          <img style="" v-if="inputImageUrl" :src="inputImageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="2">
          输出 ->
        </el-col>
        <el-col :span="22">
          <template v-if="outputImageUrl">
            <img style="height: 285px" :src="outputImageUrl" class="avatar">
            <el-button @click="dialogTableVisible = true" size="small" type="success">显示详情</el-button>
          </template>
          <i v-else class="el-icon-time"> 请先提交任务</i>
        </el-col>
      </el-row>
      <el-dialog title="本次运行结果" v-model="dialogTableVisible" size="large">
        <el-row style="margin-top: 20px">
            <el-form v-if="taskList[0]" label-position="left" class="display-table-expand">
              <el-form-item label="状态:">
                <el-tag type="success">{{ taskList[0].State }}</el-tag>
              </el-form-item>
              <el-form-item label="任务ID:">
                <el-tag type="primary">{{ taskList[0].TaskId }}</el-tag>
              </el-form-item>
              <el-form-item label="开始时间:">
                <el-tag type="primary">{{ taskList[0].StartTime | time_formatter }}</el-tag>
              </el-form-item>
              <el-form-item label="结束时间:">
                <el-tag type="primary">{{ taskList[0].EndTime | time_formatter }}</el-tag>
              </el-form-item>
              <el-form-item label="CPU时间:">
                <el-tag type="primary">{{ taskList[0].CPUUsage }}</el-tag> 毫秒
              </el-form-item>
              <el-form-item label="9 分钱可以处理相同图片:">
                约 <el-tag type="danger">{{ count }}</el-tag> 张
              </el-form-item>
            </el-form>
            <i v-else class="el-icon-time"> 请先提交任务</i>
        </el-row>
      </el-dialog>

    </el-card>
  </div>
</template>

<style>
.el-upload-list--picture .el-upload-list__item-thumbnail {
  width: 120px
}
</style>

<script>
// import { stateHash, connTypeHash, optionConnTypeHash, optionStateHash } from '../hash/k_v'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
moment.locale('zh-cn')
import backendConf from '../config/backendConf'
const url = backendConf.url

import inputImg from '../../src/assets/sh.jpeg'
// import outputImg from '../../src/assets/out.png'
export default {
  name: 'Demo1',
  data () {
    return {
      dialogTableVisible: false,
      active: 1,
      searching: false,
      fileList: [],
      inputImageUrl: '',
      outputImageUrl: '',
      taskList: [{
      }]
    }
  },
  filters: {
    time_formatter (value) {
      return moment(value, 'X').format('LLLL')
    }
  },
  computed: {
    count () {
      return 3600 / (this.taskList[0].EndTime - this.taskList[0].StartTime)
    }
  },
  methods: {
    next () {
      if (this.active++ > 2) this.active = 0
    },
    debounceLoadAccountInfo: _.debounce(
      function () {
        this.loadAccountInfo()
      },
    500
    ),
    submitUpload () {
      let vm = this
      vm.active = 2
      vm.searching = true
      var payload = {
        Region: 'cn-bj2',
        Action: 'SubmitTask',
        ImageName: 'cn-bj2.ugchub.service.ucloud.cn/tic_demo/doodle_demo:v1.4',
        TaskName: 'tic_demo',
        Timeout: 120,
        OutputDir: '/tmp',
        OutputFileName: 'out.png',
        ProjectId: 'org-a3nvhv'
      }
      axios.get(url + 'api/submit_task/', {
        params: payload
      })
      .then(function (response) {
        vm.$message({
          message: '请求处理成功',
          type: 'success'
        })
        vm.active = 3
        vm.searching = false
        vm.outputImageUrl = '/data/out.png'
        vm.getTaskList('cn-bj2.ugchub.service.ucloud.cn/tic_demo/doodle_demo:v1.4')
      })
      .catch(function (error) {
        console.info(error)
        vm.$message.error('服务器提了一个错误，稍后再试')
        vm.searching = false
      })
    },
    getTaskList (imageName) {
      let vm = this
      var payload = {
        Region: 'cn-bj2',
        ImageName: imageName // 'cn-bj2.ugchub.service.ucloud.cn/tic_demo/doodle_demo:v1.4'
      }
      axios.get(url + 'api/list_task/', {
        params: payload
      })
      .then(function (response) {
        vm.$message({
          message: '请求处理成功',
          type: 'success'
        })
        vm.taskList = response.data['TaskSet']
        vm.active = 4
        vm.dialogTableVisible = true
      })
      .catch(function (error) {
        console.info(error)
        vm.$message.error('服务器提了一个错误，稍后再试')
      })
    }
  },
  mounted () {
    document.title = 'TIC · UGC通用计算演示'
    this.fileList = [{name: 'sh.jpeg', url: inputImg}]
    this.inputImageUrl = inputImg
    this.outputImageUrl = ''
  }
}
</script>
