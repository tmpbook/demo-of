<template lang="html">
  <el-menu default-active="1" id="nav-menu" theme="dark">
    <div class="logo">
      <router-link to="/">
        <!--<img src="../../assets/images/vector_space_illust.svg" />-->
        <p>TIC 演示</p>
      </router-link>
    </div>
    <el-menu-item index="1-1"><router-link to="/FirstDemoDisplay" class="nav-link"><i class="el-icon-document"></i> 图片风格化</router-link></el-menu-item>
    <el-menu-item index="1-2"><router-link to="/SecondDemoDisplay" class="nav-link"><i class="el-icon-document"></i> 示例二</router-link></el-menu-item>
    <el-menu-item index="3"><a href="/" class="nav-link"><i class="el-icon-caret-left "></i> 返回首页</a></el-menu-item>
  </el-menu>
</template>

<style>
 p {
   font-family: 微软雅黑
 }
</style>
