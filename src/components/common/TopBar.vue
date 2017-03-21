<template>
  <el-row class="top-bar">
    <div class="top-wrapper">
      <el-col :span="8" class="search-area pull-right">
        <el-form onsubmit="return false;">
          <el-form-item>
            <i class="el-icon-search"></i>
            <el-input placeholder="搜索"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import axios from 'axios'
import backendConf from '../../config/backendConf'
var url = backendConf.url
export default {
  data () {
    return {
      user: '未知',
      avatar_url: 'http://img0.imgtn.bdimg.com/it/u=1787407765,2524017231&fm=11&gp=0.jpg'
    }
  },
  methods: {
    signOut () {
      console.log('退出登录')
    },
    getCurrentUser () {
      let vm = this
      axios.get(url + 'common-api/get_current_user')
      .then(function (response) {
        vm.user = response.data.current_user
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted () {
    // this.getCurrentUser()
  }
}
</script>
