<template>
  <div class="crud">
    <el-card class="box-card" style="position: relative">
      <div slot="header" class="clearfix header">
        <div class="actions">
          <el-button size="small"  type="primary"  v-loading="active == 2"
          :disabled="false" @click.prevent="submit">批量水印</el-button>
          <el-button size="small"  type="primary"
            :disabled="active !== 3" @click="review">查看结果</el-button>
          <el-button size="small"  type="primary" :disabled="active == 2" @click="clear">清空</el-button>
        </div>
        <el-steps class="steps" :space="100" :active="active">
          <el-step title="上传"></el-step>
          <el-step title="处理"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <el-upload class="upload"
        action="/api/posts/"
        :multiple="true"
        :on-error="fix"
        :on-preview="preview"
        :on-remove="remove"
        :file-list="files"
        list-type="picture-card">
        <div  class="uploadBtn">
        <el-button size="small" type="primary" slot="trigger"
          :disabled="active == 2" @click="">上传图片</el-button>
        </div>
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="images" v-loading="active == 2">
        <span v-if="active !== 3">请先上传文件，然后进行批量处理</span>
        <div v-else>
          批量处理水印后输出：
          <vueImages :imgs="images" :showclosebutton="true" :showthumbnails="true" />
        </div>
      </div>
    </el-card>
    <el-dialog title="本次处理结果" size="large" v-model="showDetail" v-if="detail">
        <el-row style="margin-top: 20px">
            <el-form label-position="left" class="display-table-expand">
              <el-form-item label="任务数:">
                <el-tag type="success">100</el-tag>
              </el-form-item>
              <el-form-item label="状态:">
                <el-tag type="success">{{ detail.State }}</el-tag>
              </el-form-item>
              <el-form-item label="开始时间:">
                <el-tag type="primary">{{ detail.StartTime | timer }}</el-tag>
              </el-form-item>
              <el-form-item label="结束时间:">
                <el-tag type="primary">{{ detail.EndTime | timer }}</el-tag>
              </el-form-item>
              <el-form-item label="CPU时间:">
                <el-tag type="primary">{{ detail.CPUUsage }}</el-tag> 毫秒
              </el-form-item>
              <!--el-form-item label="9 分钱可以处理相同图片:">
                约 <el-tag type="danger">{{ count }}</el-tag> 张
              </el-form-item-->
            </el-form>
        </el-row>
      </el-dialog>
  </div>
</template>

<style scope>
  hr {
    color: #99a9bf;
  }
  .display-table-expand {
    font-size: 0;
  }
  .display-table-expand label {
    width: 190px;
    color: #99a9bf;
  }
  .display-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .create-table-expand {
    font-size: 0;
  }
  .create-table-expand label {
    width: 190px;
    color: #99a9bf;
  }
  .create-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  p {
    color: #99a9bf;
  }
  .motai .el-input__inner {
    width: 300px;
  }
  .motai .el-form-item {
    margin-bottom: 20px;
  }
</style>

<script>

//import { stateHash, connTypeHash, optionConnTypeHash, optionStateHash } from '../hash/k_v'
import axios from 'axios'
import moment from 'moment'
import backendConf from '../config/backendConf'
import vueImages from 'vue-images/dist/vue-images.js';

import 'vue-images/dist/vue-images.css';

moment.locale('zh-cn')
const url = backendConf.url
const dir = {
  in: 'http://106.75.30.158/data/input',
  out: 'http://106.75.30.158/data/output'
};
const arr = new Array(100).fill(0);
const files = arr.map((v, i)=> `/asserts/${i}.jpeg`);
const images = arr.map((v, i)=> {
  const name = `${i+1}.jpeg`

  return {
    imageUrl: `${dir.out}/${name}`,
    caption: `${name}`
  }
});

const submitParams = {
  Region: 'cn-bj2',
  Action: 'SubmitTask',
  ImageName: 'cn-bj2.ugchub.service.ucloud.cn/tic_demo/watermark:1.0.2',
  TaskName: 'tic_demo',
  Timeout: 120,
  OutputDir: '/tmp',
  OutputFileName: '1.png',
  ProjectId: 'org-a3nvhv'
}

const listParams = {
  Region: 'cn-bj2',
  ImageName: 'cn-bj2.ugchub.service.ucloud.cn/tic_demo/watermark:1.0.2',
  Limit: 100
}

export default {
  name: 'togother',
  data () {
    return {
      active: 1,
      detail: null,
      showDetail: false,
      uploaded: false,
      finished: false,
      files: [],
      images
    }
  },
  filters: {
    timer (value) {
      return moment(value, 'X').format('L')
    }
  },
  computed: {
  },
  methods: {
    upload: function() {

    },
    remove: function() {

    },
    preview: function() {

    },
    prefetch: function() {

    },
    cancel: function() {
      const {name, url} = file;
      const len = files.length;

      /*this.files.push({
        name,
        url: `${dir.in}/${len+1}.jpeg`,
        status: 'finished'
      })

      return false;*/
    },
    fix: function(error, file, files) {
      const {name, url} = file;
      const len = files.length;

      files.push({
        name,
        url: `${dir.in}/${len+1}.jpeg`,
        status: 'finished'
      })

      this.files = files;
    },
    clear: function() {
      this.files = [];
      this.active = 1;
      this.tasks = [];
      this.showDetail = false;
    },
    submit: function() {
      this.active = 2;

      const done = ()=> {
        this.$message({
          message: '批量处理完成',
          type: 'success'
        })

        this.active = 3;
        this.submited();
      }

      axios.get(url + 'api/submit_task2/', {params: submitParams})
        .then(done)
        .catch(done)
    },
    submited: function() {
      axios.get(url + 'api/list_task/', {params: listParams})
        .then(res=> {
          this.$message({
            message: '请求处理成功',
            type: 'success'
          })

          this.tasks = res.data.TaskSet;
          this.review();
        }).catch(error=> {
          console.error(error);
          this.$message.error('服务器返回错误，请稍后再试！')
        })
    },
    review: function() {
      this.detail = this.tasks[0];
      this.showDetail = true;
    }

  },
  watch: {},
  mounted () {
    this.prefetch()
  },
  components: {
    vueImages
  }
}
</script>
<style>
  .images .vue-images .gallery {
    display: block;
  }

  .images .vue-images .gallery .wrapper {
    display: inline-block;
    margin-right: 10px;
  }

  .el-upload-list--picture-card .el-upload-list__item, .el-upload.el-upload--picture-card {
    width: 240px;
    height: 100px;
  }

  .el-upload.el-upload--picture-card {
    line-height: 100px;
  }
</style>
<style scoped>
  .header {
    height: 60px;
    line-height: 60px;
  }

  .actions {
    position: absolute;
    left: 95px;
    top: 18px;
  }

  .uploadBtn {
    position: absolute;
    left: 10px;
    top: -25px;
    line-height: 146px;
  }

  .steps {
    float: right;
  }

  .upload {
    max-height: 320px;
    max-width: 1200px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .images {
    border-top: 2px dashed #eee;
    margin: 20px -20px;
    padding: 20px;
    line-height: 25px;
    max-width: 1200px;
  }
</style>
<template>
  <div class="crud">
    <el-card class="box-card" style="position: relative">
      <div slot="header" class="clearfix header">
        <div class="actions">
          <el-button size="small"  type="primary"  v-loading="active == 2"
          :disabled="files.length < 1" @click.prevent="submit">批量水印</el-button>
          <el-button size="small"  type="primary"
            :disabled="active !== 3" @click="review">查看结果</el-button>
          <el-button size="small"  type="primary" :disabled="active == 2" @click="clear">清空</el-button>
        </div>
        <el-steps class="steps" :space="100" :active="active">
          <el-step title="上传"></el-step>
          <el-step title="处理"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <el-upload class="upload"
        action="/api/posts/"
        :multiple="true"
        :on-error="fix"
        :on-preview="preview"
        :on-remove="remove"
        :file-list="files"
        list-type="picture-card">
        <div  class="uploadBtn">
        <el-button size="small" type="primary" slot="trigger"
          :disabled="active == 2" @click="">上传图片</el-button>
        </div>
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="images" v-loading="active == 2">
        <span v-if="active !== 3">请先上传文件，然后进行批量处理</span>
        <div v-else>
          批量处理水印后输出：
          <vueImages :imgs="images" :showclosebutton="true" :showthumbnails="true" />
        </div>
      </div>
    </el-card>
    <el-dialog title="本次处理结果" size="large" v-model="showDetail" v-if="detail">
        <el-row style="margin-top: 20px">
            <el-form label-position="left" class="display-table-expand">
              <el-form-item label="任务数:">
                <el-tag type="success">100</el-tag>
              </el-form-item>
              <el-form-item label="状态:">
                <el-tag type="success">{{ detail.State }}</el-tag>
              </el-form-item>
              <el-form-item label="开始时间:">
                <el-tag type="primary">{{ detail.StartTime | timer }}</el-tag>
              </el-form-item>
              <el-form-item label="结束时间:">
                <el-tag type="primary">{{ detail.EndTime | timer }}</el-tag>
              </el-form-item>
              <el-form-item label="CPU时间:">
                <el-tag type="primary">{{ detail.CPUUsage }}</el-tag> 毫秒
              </el-form-item>
              <!--el-form-item label="9 分钱可以处理相同图片:">
                约 <el-tag type="danger">{{ count }}</el-tag> 张
              </el-form-item-->
            </el-form>
        </el-row>
      </el-dialog>
  </div>
</template>

<style scope>
  hr {
    color: #99a9bf;
  }
  .display-table-expand {
    font-size: 0;
  }
  .display-table-expand label {
    width: 190px;
    color: #99a9bf;
  }
  .display-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .create-table-expand {
    font-size: 0;
  }
  .create-table-expand label {
    width: 190px;
    color: #99a9bf;
  }
  .create-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  p {
    color: #99a9bf;
  }
  .motai .el-input__inner {
    width: 300px;
  }
  .motai .el-form-item {
    margin-bottom: 20px;
  }
</style>

<script>

//import { stateHash, connTypeHash, optionConnTypeHash, optionStateHash } from '../hash/k_v'
import axios from 'axios'
import moment from 'moment'
import backendConf from '../config/backendConf'
import vueImages from 'vue-images/dist/vue-images.js';

import 'vue-images/dist/vue-images.css';

moment.locale('zh-cn')
const url = backendConf.url
const dir = {
  in: 'http://106.75.30.158/data/input',
  out: 'http://106.75.30.158/data/output'
};
const arr = new Array(100).fill(0);
const files = arr.map((v, i)=> `/asserts/${i}.jpeg`);
const images = arr.map((v, i)=> {
  const name = `${i+1}.jpeg`

  return {
    imageUrl: `${dir.out}/${name}`,
    caption: `${name}`
  }
});

const submitParams = {
  Region: 'cn-bj2',
  Action: 'SubmitTask',
  ImageName: 'cn-bj2.ugchub.service.ucloud.cn/tic_demo/watermark:1.0.2',
  TaskName: 'tic_demo',
  Timeout: 120,
  OutputDir: '/tmp',
  OutputFileName: '1.png',
  ProjectId: 'org-a3nvhv'
}

const listParams = {
  Region: 'cn-bj2',
  ImageName: 'cn-bj2.ugchub.service.ucloud.cn/tic_demo/watermark:1.0.2',
  Limit: 100
}

export default {
  name: 'togother',
  data () {
    return {
      active: 1,
      detail: null,
      showDetail: false,
      uploaded: false,
      finished: false,
      files: [],
      images
    }
  },
  filters: {
    timer (value) {
      return moment(value, 'X').format('L')
    }
  },
  computed: {
  },
  methods: {
    upload: function() {

    },
    remove: function() {

    },
    preview: function() {

    },
    prefetch: function() {

    },
    cancel: function() {
      const {name, url} = file;
      const len = files.length;

      /*this.files.push({
        name,
        url: `${dir.in}/${len+1}.jpeg`,
        status: 'finished'
      })

      return false;*/
    },
    fix: function(error, file, files) {
      const {name, url} = file;
      const len = files.length;

      files.push({
        name,
        url: `${dir.in}/${len+1}.jpeg`,
        status: 'finished'
      })

      this.files = files;
    },
    clear: function() {
      this.files = [];
      this.active = 1;
      this.tasks = [];
      this.showDetail = false;
    },
    submit: function() {
      this.active = 2;

      const done = ()=> {
        this.$message({
          message: '批量处理完成',
          type: 'success'
        })

        this.active = 3;
        this.submited();
      }

      axios.get(url + 'api/submit_task2/', {params: submitParams})
        .then(done)
        .catch(done)
    },
    submited: function() {
      axios.get(url + 'api/list_task/', {params: listParams})
        .then(res=> {
          this.$message({
            message: '请求处理成功',
            type: 'success'
          })

          this.tasks = res.data.TaskSet;
          this.review();
        }).catch(error=> {
          console.error(error);
          this.$message.error('服务器返回错误，请稍后再试！')
        })
    },
    review: function() {
      this.detail = this.tasks[0];
      this.showDetail = true;
    }

  },
  watch: {},
  mounted () {
    this.prefetch()
  },
  components: {
    vueImages
  }
}
</script>
<style>
  .images .vue-images .gallery {
    display: block;
  }

  .images .vue-images .gallery .wrapper {
    display: inline-block;
    margin-right: 10px;
  }

  .el-upload-list--picture-card .el-upload-list__item, .el-upload.el-upload--picture-card {
    width: 240px;
    height: 100px;
  }

  .el-upload.el-upload--picture-card {
    line-height: 100px;
  }
</style>
<style scoped>
  .header {
    height: 60px;
    line-height: 60px;
  }

  .actions {
    position: absolute;
    left: 95px;
    top: 18px;
  }

  .uploadBtn {
    position: absolute;
    left: 10px;
    top: -25px;
    line-height: 146px;
  }

  .steps {
    float: right;
  }

  .upload {
    max-height: 320px;
    max-width: 1200px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .images {
    border-top: 2px dashed #eee;
    margin: 20px -20px;
    padding: 20px;
    line-height: 25px;
    max-width: 1200px;
  }
</style>
