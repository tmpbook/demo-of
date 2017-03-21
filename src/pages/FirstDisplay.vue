<template>
  <div class="crud">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        图片风格化
      </div>

      <el-row style="margin-top: 30px">
        <el-col :span="12">
          <img style="" v-if="inputImageUrl" :src="inputImageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-col>
      </el-row>
    

      <el-row style="margin-top: 30px">
        <el-col :span="12">
          <el-upload
            class="upload-demo"
            action="//jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary" @click="submitUpload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
          </el-upload>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 30px">
        <el-col :span="12">
          <img style="height: 285px" v-if="outputImageUrl" :src="outputImageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
      searching: false,
      fileList: [],
      inputImageUrl: '',
      outputImageUrl: ''
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
    debounceLoadAccountInfo: _.debounce(
      function () {
        this.loadAccountInfo()
      },
    500
    ),
    submitUpload () {
      let vm = this
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
        // vm.responseList = response.data
        vm.searching = false
        vm.outputImageUrl = "/tmp/out.png"
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
