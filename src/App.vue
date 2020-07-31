<template>
  <div id="app">

    <div>
      <div class="main-head">
        <div class="head-img">
          <img :src="head_img" height="50px" width="50px"/>
          <span>接口测试平台</span>
        </div>

        <div>
          <i class="el-icon-info icon-color"></i>关于
        </div>

      </div>
    </div>

    <router-view/>

  </div>
</template>

<script>
  import head_icon from './assets/head_icon.png'

  export default {
    name: 'App',
    data() {
      return {
        head_img: head_icon,
      }
    }

  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0px;
  }

  /*修改body的样式*/
  body {
    margin: 0px;
  }

  .main-head {
    background: cadetblue;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
  }

  .head-img {
    display: flex;
    align-items: center;

  }

  .head-img span {
    font-size: 20px;
    margin-left: 10px;

  }

  . icon-color {
    color: black;
    margin-left: 0px;
  }

</style>
