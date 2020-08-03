<template>
  <div class="whole-template">

    <div id="box" class="login-main-context">
      <div style="text-align: center;font-weight:700">请使用账号登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm ruleForm">

        <el-form-item label="用户账号" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="登录密码" prop="name">
          <el-input v-model="ruleForm.pwd" type="password"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="register-button">
            <el-button type="danger" @click="register">注册</el-button>
          </div>
          <div class="login-button">
            <el-button type="primary" @click="login">登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
  import {login} from "../requests/user";
  import {register} from "../requests/user";
  import VueCookies from 'vue-cookies';



  export default {
    name: "login",
    data() {
      return {
        ruleForm: {
          name: '',
          pwd: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入登录用户名', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入登陆密码', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
          ],
        }
      }
    },

    methods: {
      login() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            login(this.ruleForm.name, this.ruleForm.pwd).then(data => {
              if (data.success === true) {
                let session=data.data.session;
                VueCookies.set('token',session,1209600);
                console.log(document.cookie)
                this.$router.push('/')
                // window.location='/'
                this.$message.success("登录成功!")
              } else {
                return this.$message.error(data.message)

              }
            })
          } else {
            return this.$message.error("请输入正确的用户名和密码！")
          }
        });

      },
      register() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            register(this.ruleForm.name, this.ruleForm.pwd).then(data => {
              if (data.success === true) {
                this.$router.push('/')
                return this.$message.success("注册成功!")
              } else {
                return this.$message.error("注册失败!")

              }
            })
          } else {
            return this.$message.error("输入参数不正确")
          }
        });
      },

    }
  }
</script>
import head_icon from './assets/head_icon.png'
<style scoped>

  .login-main-context {
    width: 400px;
    height: 200px;
    margin-top: 150px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #999;
    padding-top: 20px;
    padding-right: 25px;
    padding-bottom: 20px;
    border-radius: 5px;
    /*background:url('https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1595827017&di=e791af16a413851f6dc83c33dc639946&src=http://dik.img.kttpdq.com/pic/142/99386/5bdc6bc2302e4423_1440x900.jpg');*/
    background: azure;
  }

  .login-button {

    float: right;
  }

  .register-button {

    float: left;
  }

  .ruleForm {
    margin-top: 20px;
  }

  .whole-template {
    background: url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595838992732&di=ed7e6a2746570570ba881bf86af9b0e8&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F7%2F57f9a94bd52c0.jpg');
    background-size: 100% 100%;
    position: fixed;
    height: 100%;
    width: 100%
  }

</style>
