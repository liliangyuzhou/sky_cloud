<template>

  <div class="index-main-div">
    <!--  <div class="hello">-->
    <!--    hello，更好玩的测试接口平台等你来玩！-->
    <!--  </div>-->

    <el-menu :default-active="active_tab" class="el-menu-vertical-demo index-menu"
             :collapse="isCollapse" @select="handle_select">

      <el-menu-item index="1">
        <i class="el-icon-location"></i>
        <span slot="title">接口</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">任务</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title">mock</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">调试</span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="el-icon-star-on"></i>
        <span slot="title">图表</span>
      </el-menu-item>
      <el-menu-item index="6">
        <i class="el-icon-monitor"></i>
        <span slot="title">功能测试用例管理</span>
      </el-menu-item>
    </el-menu>

    <div class="index-context">
      <services v-if="tab === '1'"></services>
      <debug_interface v-if="tab === '4'"></debug_interface>
    </div>
  </div>
</template>

<script>
  import {get_user} from "../requests/user";
  import services from "./service/services";
  import debug_interface from "./debug/debug_interface";

  export default {
    name: 'index',
    props:['tab'],//url中传进来的参数
    components: {services,debug_interface},
    data() {
      return {
        current_user: {},
        isCollapse: true,
        active_tab:'1',
      }
    },
    methods: {

      handle_select: function (index, index_path) {
        this.$router.push('/index/'+index).catch(err=>err)


      }
    },
    mounted() {
      get_user().then(data => {
        if (data['success'] === true) {
          this.current_user = data.data;
          this.$message.success("获取用户成功！")
        } else {
          this.$router.push('/login')
          this.$message.error(data.message)
        }
      });
      this.active_tab=this.tab;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;

  }

  .index-main-div {
    display: flex;
    height: 100%;
  }

  .index-menu {
    width: 6%;

  }

  .index-context {
    width: 94%;
    text-align: left;
  }

</style>
