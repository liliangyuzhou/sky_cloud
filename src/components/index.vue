<template>
  <div class="hello">
    hello，更好玩的测试接口平台等你来玩！
  </div>
</template>

<script>
  import {get_user} from "../requests/user";

  export default {
    name: 'index',
    data() {
      return {
        current_user: {},
      }
    },
    method: {},
    mounted() {
      get_user().then(data => {
        if (data['success'] === true) {
          this.current_user = data.data;
          this.$message.success("获取用户成功！")
        } else {
          this.$router.push('/login')
          this.$message.error(data.message)
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
