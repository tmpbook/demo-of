<template>
  <div class="crud">
   <h3>基于UGC图片水印高并发场景</h3>
    <el-card class="box-card" style="position: relative">
      <div slot="header" class="clearfix header">
        <div class="actions">
          <el-button size="small"  type="primary"
          :disabled="files.length < 1" @click="mark">批量水印</el-button>
          <el-button size="small"  type="primary"
            :disabled="active !== 3" @click="review">查看结果</el-button>
          <el-button size="small"  type="primary" :disabled="active == 2" @click="clear">清空</el-button>
        </div>
        <el-steps class="steps" :space="100" :active="active" finish-status="finish">
          <el-step title="上传"></el-step>
          <el-step title="处理"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <el-upload class="upload"
        action="http://106.75.30.158/api/posts/"
        :multiple="true"
        :before-upload="cancel"
        :file-list="files"
        list-type="picture-card">
        <div  class="uploadBtn">
        <el-button size="small" type="primary" slot="trigger"
          :disabled="active == 2" @click="">上传图片</el-button>
        </div>
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div class="images" v-loading="active == 2">
        <span v-if="active !== 3">请先上传文件，然后进行
          <el-button size="small"  type="primary"
          :disabled="files.length < 1" @click="mark">批量水印</el-button> 处理</span>
        <div v-else>
          批量处理水印后输出：
          <vueImages :imgs="images" :showclosebutton="true" :showthumbnails="true" />
        </div>
    </div>
    </el-card>

    <h4>任务详情：</h4>
    <el-card class="box-card" style="position: relative; margin-top: 10px">
      <div style="max-height: 500px;overflow-y: auto">
        <el-table :data="tasks" style="width:100%">
          <el-table-column prop="i" label="任务"></el-table-column>
          <el-table-column prop="State" label="状态">
            <template scope="scope">
              <el-tag
                :type="scope.row.i === 'success' ? 'success' : 'primary'"
                close-transition>{{scope.row.i}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ts" label="开始时间"></el-table-column>
          <el-table-column prop="te" label="结束时间"></el-table-column>
          <el-table-column prop="CPUUsage" label="CPU耗时(ms)"></el-table-column>
        </el-table>
        <p v-if="showDetail">100次并发任务耗时：<el-tag>{{ duration.toFixed(1) }}</el-tag> 秒，100次任务CPU耗时：<el-tag>{{ timer }}</el-tag> 毫秒，CPU耗时小于1小时不计费。单价：0.09元/核每小时</p>
        <p v-else>请先上传文件，然后进行批量处理</p>
      </div>
    </el-card>

    <el-dialog title="批量水印" v-model="showMarkDialog" size="tiny">
      <el-form :model="form" label-width="80px" style="margin-right:50px;">
        <el-form-item label="水印">
          <el-input v-model="form.Mark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMarkDialog = false">取 消</el-button>
        <el-button type="primary" @click="()=>submit(form.Mark)">确 定</el-button>
      </div>
    </el-dialog>
    <!--<el-dialog title="本次处理结果" size="large" v-model="showDetail" v-if="true">
      <h3>100次并发任务耗时：<el-tag>{{ duration.toFixed(1) }}</el-tag> 秒，100次任务CPU耗时：<el-tag>{{ timer }}</el-tag> 毫秒，CPU耗时小于1小时不计费。单价：0.09元/核每小时</h3>
      <div style="max-height: 500px;overflow-y: auto">
        <el-table :data="tasks" style="width:100%">
          <el-table-column prop="i" label="任务"></el-table-column>
          <el-table-column prop="State" label="状态"></el-table-column>
          <el-table-column prop="ts" label="开始时间"></el-table-column>
          <el-table-column prop="te" label="结束时间"></el-table-column>
          <el-table-column prop="CPUUsage" label="CPU耗时(ms)"></el-table-column>
        </el-table>
      </div>
    </el-dialog>-->
  </div>
</template>

<style scope>
  .crud {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
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
import vueImages from 'vue-images/dist/vue-images.js'
import _ from 'lodash'

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
      showMarkDialog: false,
      files: [],
      cache: {},
      tasks: [],
      form: {Mark: 'UCloud'},
      images
    }
  },
  methods: {
    cancel: function({uid}) {
      const len = this.files.length;
      const name = `${len + 1}.jpeg`;
      const url = `${dir.in}/${name}`;
      let count = 0;

      const file = {
        url,
        uid,
        name,
        size: 2431884,
        percentage: 0,
        status: 'uploading',
        showProgress: true
      }

      this.files.push(file);
      this.cache[len] = file;

      const unwatch = this.$watch('cache.'+ len, function(file){
          file.showProgress && file.status === 'success' && (file.status = 'uploading')
      }, {deep: true, immediate: true})

      const next = ()=> {
        count ++;

        if (count > 9) {
          unwatch()

          file.status = 'success';
          file.showProgress = false;
        } else {
          file.percentage += 10;

          setTimeout(next, 60)
        }
      }

      setTimeout(next, 80)

      return false;
    },
    clear: function() {
      this.files = [];
      this.active = 1;
      this.tasks = [];
      this.showDetail = false;
    },
    mark: function() {
      this.showMarkDialog = true;
      this.form = {Mark: 'UCloud'}
    },
    submit: function(Mark) {
      this.active = 2;
      this.showMarkDialog = false;
      setTimeout(() => {
        this.submited();
      }, 100);

      const done = ()=> {
        this.$message({
          message: '批量处理完成',
          type: 'success'
        })

        this.active = 3;
        this.submited();
      }

      axios.get(url + 'api/submit_task2/', {params: {...submitParams, Mark}})
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

          this.tasks = res.data.TaskSet.map((task, i)=> {
            const te = moment(task.EndTime * 1000).format('YYYY-MM-DD hh:mm:ss');
            const ts = moment(task.StartTime * 1000).format('YYYY-MM-DD hh:mm:ss');

            return {...task, te, ts, i}
          });
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
  computed: {
    duration: function(){
      return this.tasks.reduce((pre, curr)=> {
        const tm = curr.EndTime - curr.StartTime;
        return tm  + pre;
      }, 0)
    },
    timer: function () {
      let count = 0
      _.forEach(this.tasks, function(data) {
        count += data.CPUUsage
      })
      return count
    }
  },
  mounted () {
    document.title = 'TIC · 自定义水印'
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
    margin-right: 7px;
    width: 160px;
    height: 100px;
  }

  .images .vue-images .gallery .wrapper  img {
    width: 158px;
    height: 100px;
    border-radius: 5px;
  }

  .el-upload-list--picture-card .el-upload-list__item, .el-upload.el-upload--picture-card {
    width: 160px;
    height: 100px;
  }

  .el-upload.el-upload--picture-card {
    line-height: 100px;
  }

  .images .fancybox .image-wrapper .image {
    width: 640px;
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
    max-width: 1200px;
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
