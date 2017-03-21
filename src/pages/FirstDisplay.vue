<template>
  <div class="crud">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
      <div style="float: right; margin-top: 20px">图像画风转换</div>
          <el-steps :space="100" :active="active" style="">
            <el-step icon="edit" title="选取文件"></el-step>
            <el-step icon="upload" title="提交算法"></el-step>
            <el-step icon="picture" title="返回结果"></el-step>
            <el-step icon="more" title="详细参数"></el-step>
          </el-steps>
      </div>
    
      <el-row>
        <el-col :span="12">
          <el-upload
            class="upload-demo"
            action="//jsonplaceholder.typicode.com/posts/"
            :file-list="fileList"
            :auto-upload="true">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :loading="searching">提交任务</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
          </el-upload>
        </el-col>
      </el-row>

      <el-row style="margin-top: 30px">
        <el-col :span="4">
          原图
        </el-col>
        <el-col :span="20">
          <img style="" v-if="inputImageUrl" :src="inputImageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="4">
          结果
        </el-col>
        <el-col :span="20">
          <img style="height: 285px" v-if="outputImageUrl" :src="outputImageUrl" class="avatar">
          <i v-else class="el-icon-time"> 请先提交一个任务</i>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="4">
          分析
        </el-col>
        <el-col :span="20">
          <el-form v-if="taskList" label-position="left" inline class="display-table-expand">
            <el-form-item label="Vlan">
              <span>{{ taskList[0].State }}</span>
            </el-form-item>
            <el-form-item label="Vlan">
              <span>{{ taskList[0].TaskId }}</span>
            </el-form-item>
            <el-form-item label="Vlan">
              <span>{{ taskList[0].StartTime }}</span>
            </el-form-item>
            <el-form-item label="Vlan">
              <span>{{ taskList[0].EndTime }}</span>
            </el-form-item>
          </el-form>
          <i v-else class="el-icon-time"> 请先提交一个任务</i>
        </el-col>
      </el-row>
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
      active: 1,
      searching: false,
      fileList: [],
      inputImageUrl: '',
      outputImageUrl: '',
      taskList: []
    }
  },
  filters: {
    time_formatter (value) {
      return moment(value, 'X').format('L')
    }
  },
  computed: {
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
      vm.searching = true
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
      })
      .catch(function (error) {
        console.info(error)
        vm.$message.error('服务器提了一个错误，稍后再试')
        vm.searching = false
      })
    }
  },
  mounted () {
    document.title = '运营 · 专线客户信息管理'
    this.fileList = [{name: 'sh.jpeg', url: inputImg}]
    this.inputImageUrl = inputImg
    this.outputImageUrl = ''
  }
}
</script>
