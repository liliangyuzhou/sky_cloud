<template>
  <div class="interface-main-div">
    <h3 class="interface-title">调试接口</h3>
    <div class="interface-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
               label-position="left">

        <el-form-item label="URL" prop="url">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>

        <el-form-item label="请求方法" prop="method">
          <el-select v-model="ruleForm.method" placeholder="请选择请求方法">
            <el-option label="get" value="get"></el-option>
            <el-option label="post" value="post"></el-option>
            <el-option label="put" value="put"></el-option>
            <el-option label="patch" value="patch"></el-option>
            <el-option label="delete" value="delete"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="请求头" prop="headers">
          <editor v-model="header" @init="editorInit" lang="json" theme="chrome" width="100%"
                  height="150px"></editor>

        </el-form-item>

        <el-form-item label="请求参数" prop="parameter">
          <el-radio-group v-model="ruleForm.parameter_type">
            <el-radio label="json"></el-radio>
            <el-radio label="form"></el-radio>
          </el-radio-group>

          <editor v-if="ruleForm.parameter_type==='json'" v-model="json_parameter" @init="editorInit" lang="json"
                  theme="chrome" width="100%" height="300"></editor>

          <div v-else class="parameter-form-button">
            <el-button type="primary" @click="add_from_parameter" size="small">添加参数</el-button>
            <div class="parameter-form-body" v-for="(value,index) in form_parameter" :key>
              <div class="padding-common">
                <el-input v-model="value.key" placeholder="名称"></el-input>
              </div>
              <div class="padding-common">
                <el-input v-model="value.value" placeholder="值"></el-input>
              </div>
              <div class="padding-common">
                <el-select v-model="value.type" placeholder="请选择参数类型">
                  <el-option label="整型" value="int"></el-option>
                  <el-option label="浮点型" value="float"></el-option>
                  <el-option label="字符串型" value="string"></el-option>
                  <el-option label="布尔型" value="boolean"></el-option>
                </el-select>
              </div>
              <div class="padding-common del-button">
                <i class="el-icon-delete" @click="delete_form_parameter(index)"></i>
              </div>
            </div>

          </div>

        </el-form-item>

        <el-form-item label="响应结果" prop="response">
          <editor v-model="json_response" @init="editorInit" lang="json"
                  theme="chrome" width="100%" height="150px"></editor>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">发送</el-button>

        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>
  import {debug_interface} from "../../requests/debug";

  export default {
    name: "debug_interface",
    components: {
      editor: require('vue2-ace-editor'),
    },
    data() {
      return {

        ruleForm: {
          url: '',
          method: 'get',
          headers: "{}",
          parameter_type: 'json',
          parameter: {},
        },
        rules: {

          method: [
            {required: true, message: '请选择请求方法', trigger: 'blur'},
          ],
          parameter_type: [
            {required: false},
          ],
          url: [
            {required: true, message: '请输入url', trigger: 'blur'},
          ],
          header: [
            {required: false},
          ],
        },

        header: '{}',

        form_parameter: [],
        json_parameter: '{}',

        json_response: "{}",

      };
    },
    methods: {

      check_interface_data() {
        //处理入参
        if (this.ruleForm.parameter_type === "json") {
          try {
            //验证是否可以成功转换为字典，成功则json校验通过
            JSON.parse(this.json_parameter)
          } catch (e) {
            return "入参不是json格式"
          }
        }

        try {
          JSON.parse(this.header)
        } catch (e) {
          return "header不是json格式"
        }

        return ''
      },
      get_interface_data() {
        // 处理入参
        if (this.ruleForm.parameter_type === "json") {
          this.ruleForm.parameter = JSON.parse(this.json_parameter)
        } else {
          this.ruleForm.parameter = [];
          for (let i = 0; i < this.form_parameter.length; i++) {
            if (this.form_parameter[i].value !== "" && this.form_parameter[i].key !== "") {
              this.ruleForm.parameter.push(this.form_parameter[i])
            };
          }
        }


        //处理header
        this.ruleForm.headers = JSON.parse(this.header)
        return this.ruleForm
      },
      editorInit: function () {
        require('brace/ext/language_tools') //language extension prerequsite...
        require('brace/mode/json')
        require('brace/mode/javascript')    //language
        require('brace/mode/less')
        require('brace/theme/chrome')
      },
      // 删除
      delete_form_parameter(index) {
        this.form_parameter.splice(index, 1)
      },
      //创建
      add_from_parameter() {
        this.form_parameter.push({
          key: '',
          value: '',
          type: 'string',
        })
      },

      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let result = this.check_interface_data()
            if (result === '') {
              let data = this.get_interface_data()
              debug_interface(data).then(data=>{
                if(data.success===true){
                  this.json_response=data.data


                }else{
                  this.$message.error(data.message)
                }
              })

            } else {
              this.$message.error(result)
            }

          }
        });
      },

    },
  }
</script>

<style scoped>
  .interface-main-div {
    width: 900px;
    margin: 0 auto;

    border: lightblue solid 1px;
    padding-top: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .interface-title {
    text-align: center;
  }

  .interface-form {
    padding: 30px 60px;

  }

  .parameter-form-body {
    display: flex;
    justify-content: space-between;

  }

  .parameter-form-button {
    text-align: left;
  }

  .padding-common {
    padding: 5px 5px;

  }

  .del-button {
    color: red;
    cursor: pointer;
  }
</style>
