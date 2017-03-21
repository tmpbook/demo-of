<template lang="html">
  <el-menu default-active="1" id="nav-menu" theme="dark">
    <div class="logo">
      <router-link to="/">
        <!--<img src="../../assets/images/vector_space_illust.svg" />-->
        <p>TIC 演示页面</p>
      </router-link>
    </div>
    <el-menu-item index="1-1"><router-link to="/FirstDemoDisplay" class="nav-link"><i class="el-icon-picture"></i>画风转换</router-link></el-menu-item>
    <el-menu-item index="1-2"><router-link to="/SecondDemoDisplay" class="nav-link"><i class="el-icon-menu"></i>并发处理</router-link></el-menu-item>
    
  </el-menu>
</template>

<style>
 p {
   font-family: 微软细黑
 }
</style>
