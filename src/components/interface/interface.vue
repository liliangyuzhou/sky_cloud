<template>
  <div class="interface-main-div">
    <h3 class="interface-title">{{title}}</h3>
    <div class="interface-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
               label-position="left">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="接口描述" prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>

        <el-form-item label="HOST" prop="host">
          <el-input v-model="ruleForm.host"></el-input>
        </el-form-item>

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
          <el-radio-group v-model="ruleForm.response_type">
            <el-radio label="json"></el-radio>
            <el-radio label="text"></el-radio>
          </el-radio-group>
          <editor v-if="ruleForm.response_type==='json'" v-model="json_response" @init="editorInit" lang="json"
                  theme="chrome" width="100%" height="150px"></editor>
          <el-input v-else v-model="text_response" type="textarea" rows="5"></el-input>
        </el-form-item>

        <el-form-item label="断言" prop="response">
          <el-button type="primary" @click="add_json_assert" size="small">添加json断言</el-button>
          <div class="parameter-form-body" v-for="(value,index) in json_assert" :key>
            <div class="padding-common">
              <el-input v-model="value.key" placeholder="关键字"></el-input>
            </div>
            <div class="padding-common">
              <el-input v-model="value.value" placeholder="内容"></el-input>
            </div>
            <div class="padding-common">
              <el-select v-model="value.type" placeholder="请选择参数类型">
                <el-option label="整型" value="int"></el-option>
                <el-option label="浮点型" value="float"></el-option>
                <el-option label="字符串型" value="string"></el-option>
                <el-option label="布尔型" value="boolean"></el-option>
              </el-select>
            </div>
            <div class="padding-common">
              <el-select v-model="value.include" placeholder="请选择">
                <el-option label="包含" value="include"></el-option>
                <el-option label="不包含" value="exclude"></el-option>
              </el-select>
            </div>
            <div class="padding-common del-button">
              <i class="el-icon-delete" @click="delete_json_assert(index)"></i>
            </div>

            <!--          <div>text断言</div>-->
            <!--          <div>-->

            <!--            <div>内容</div>-->
            <!--            <div>是否包含</div>-->
            <!--            <div>删除</div>-->
            <!--          </div>-->
            <!--          <el-input v-model="ruleForm.assert"></el-input>-->
          </div>

          <el-button type="primary" @click="add_text_assert" size="small">添加text断言</el-button>
          <div class="parameter-form-body" v-for="(value,index) in text_assert" :key>
            <div class="padding-common">
              <el-select v-model="value.include" placeholder="请选择">
                <el-option label="包含" value="include"></el-option>
                <el-option label="不包含" value="exclude"></el-option>
              </el-select>
            </div>
            <div class="padding-common">
              <el-input v-model="value.key" placeholder="内容"></el-input>
            </div>

            <div class="padding-common del-button">
              <i class="el-icon-delete" @click="delete_text_assert(index)"></i>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{ -1 !== ruleForm.interface_id ? '更新':'创建'}}</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>
  import {
    get_interface_list,
    update_interface,
    get_interface,
    create_interface,
    delete_interface
  } from "../../requests/interface"

  export default {
    name: "interface",
    components: {
      editor: require('vue2-ace-editor'),
    },
    data() {
      return {

        ruleForm: {
          name: '',
          description: '',
          host: '',
          url: '',
          method: 'get',
          headers: "{}",
          parameter_type: 'json',
          parameter: {},
          response_type: 'json',
          response: "{}",
          asserts: [],

          service_id: "",//接口创建时使用，放在ul中
          interface_id: -1,//接口编辑时使用，和 service_id一起放在url中
        },
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur'}
          ],
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
        title: "创建接口",

        header: '{}',

        form_parameter: [],
        json_parameter: '{}',

        text_response: "",
        json_response: "{}",

        text_assert: [],
        json_assert: [],
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
        //处理出参
        if (this.ruleForm.response_type === "json") {
          try {
            JSON.parse(this.json_response)
          } catch (e) {
            return "出参不是json格式"
          }

        }
        //处理入参

        try {
          JSON.parse(this.header)
        } catch (e) {
          return "header不是json格式"
        }

        //判断url是否包含service的id，因为创建接口必须要明白是那个服务下的接口
        if (!this.$route.query.service) {
          return "没有传service的id"

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
            }
            ;


          }
        }

        //处理出参
        if (this.ruleForm.response_type === "json") {
          this.ruleForm.response = JSON.parse(this.json_response)
        } else {
          this.ruleForm.response = {
            text: this.text_response
          }
        }
        //处理header
        this.ruleForm.headers = JSON.parse(this.header)


        this.ruleForm.asserts = []
        //处理json断言
        for (let i = 0; i < this.json_assert.length; i++) {
          if (this.json_assert[i].value !== "" && this.json_assert[i].key !== "") {
            this.ruleForm.asserts.push(this.json_assert[i])
          }
        }
        //处理text断言
        for (let i = 0; i < this.text_assert.length; i++) {
          if (this.text_assert[i].key !== "") {
            this.ruleForm.asserts.push(this.text_assert[i])
          }

        }

        this.ruleForm.service_id = Number(this.$route.query.service)//这里从url里面获取的值是一个字符串，需要转成数字
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
      add_json_assert() {
        this.json_assert.push({
          key: '',
          value: '',
          type: 'string',
          include: 'include',
        })
      },
      delete_json_assert(index) {
        this.json_assert.splice(index, 1)
      },
      add_text_assert() {
        this.text_assert.push({
          key: '',
          include: 'include',
        })
      },
      delete_text_assert(index) {
        this.text_assert.splice(index, 1)
      },
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let result = this.check_interface_data()
            if (result === '') {
              let data = this.get_interface_data()

              if( -1 !== this.ruleForm.interface_id){
                //interface_id存在代表编辑，不存在代表新建
                update_interface(data,Number(this.ruleForm.interface_id)).then(data=>{
                  if (data.success === true) {
                    this.$message.info("接口更新成功！")

                  } else {
                    this.$message.error("接口更新失败！")
                  }
                })

              }else{
                create_interface(data).then(data => {
                  if (data.success === true) {
                    this.$message.info("接口创建成功！")
                    this.$router.push("/index/1")

                  } else {
                    this.$message.error("接口创建失败，请检查输入的参数！")
                  }
                })
              }

            } else {
              this.$message.error(result)
            }

          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.push("/index/1")
      },
      get_interface_detail() {
        get_interface(Number(this.ruleForm.interface_id)).then(data => {
          if (data.success === true) {
            this.ruleForm = data.data
            //这里必须要再次赋值给 this.ruleForm.interface_id，不然url的interface_id没传进来
            this.ruleForm.interface_id=Number(this.$route.query.interface)
            // 处理入参
            if (this.ruleForm.parameter_type === "json") {
              this.json_parameter = JSON.stringify(this.ruleForm.parameter)
            } else {
              this.form_parameter = this.ruleForm.parameter;
            }
            //处理出参
            if (this.json_response === "json") {
              this.json_response = JSON.stringify(this.ruleForm.response)
            } else {
              this.text_response = this.ruleForm.response.text

            }

            //处理header
            this.header = JSON.stringify(this.ruleForm.headers)

            //处理text断言
            //处理json断言
            this.text_assert = []
            this.json_assert = []
            // console.log(typeof this.ruleForm.asserts)
            // console.log(this.ruleForm.asserts.length)

            for (let i = 0; i <this.ruleForm.asserts.length; i++) {
              console.log(i)
              if (this.ruleForm.asserts[i].value && this.ruleForm.asserts[i].value !== "") {
                this.json_assert.push(this.ruleForm.asserts[i])
              }else{
                this.text_assert.push(this.ruleForm.asserts[i])
              }
            }
            console.log(this.json_assert)
            console.log(this.text_assert)

          }else{
            this.$message.error("接口信息获取失败！")

          }


        }).catch(err=>{})

      },

    },
    created() {
      let interface_id = this.$route.query.interface
      if (interface_id) {
        //interface_id存在代表更新，不存在代表创建
        this.title = "编辑接口"
        this.ruleForm.interface_id = Number(interface_id)
        this.get_interface_detail()

      } else {
        this.title = "创建接口"
      }

    }


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
