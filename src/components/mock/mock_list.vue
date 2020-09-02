<template>

  <div class="div-main">
    <el-button type="primary" @click="open_add_mock" size="small">创建mock</el-button>
    <!--    因为要分页，所以不能直接赋值父组件传进来的数据mocks，需要在计算属性里面计算下，返回计算后的mocks数据-->
    <!--      :data="mocks"-->
    <el-table
      :data="page_data"
      style="width: 100%"
      height="510px">
      <el-table-column
        fixed
        prop="name"
        label="名称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="300">
      </el-table-column>
      <el-table-column
        prop="method"
        label="方法"
        width="250">
      </el-table-column>
      <el-table-column
        prop="url"
        label="URL"
        width="500">
        <template slot-scope="scope">
          <span>http://localhost:8000/backend/mock/{{scope.row.id}}/run</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="ops"
        label="操作"
        width="380">
        <template slot-scope="scope">
          <el-button @click="open_edit_mock(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="open_delete_mock(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-style">
      <el-pagination
        v-if="page.total !==0"
        :page-size="page.page_size"
        :current_apge="page.current" @current-change="current_change"
        background
        layout="total,prev, pager, next"
        :total="page.total">
      </el-pagination>
    </div>

    <el-dialog :title="dialog_title" :visible.sync="dialog_Visible" width="35%">
      <el-form :model="form" label-width="80px" :rules="rules" ref="form" label-position="left">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="form.description" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="请求方法" prop="method">
          <el-select v-model="form.method" placeholder="请选择请求方法">
            <el-option label="get" value="get"></el-option>
            <el-option label="post" value="post"></el-option>
            <el-option label="put" value="put"></el-option>
            <el-option label="patch" value="patch"></el-option>
            <el-option label="delete" value="delete"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  label="响应" prop="response">
          <editor v-model="form.response" @init="editorInit" lang="json" theme="chrome" width="100%" height="150px"></editor>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_Visible = false">取 消</el-button>
        <el-button type="primary" @click="submit_form">确 定</el-button>
      </div>
    </el-dialog>


  </div>

</template>

<script>
  import {update_mock, get_mock_list, delete_mock, create_mock} from "../../requests/mock";

  export default {
    name: "mock_list",
    components: {
      editor: require('vue2-ace-editor'),
    },
    data() {
      return {
        // tableData:[],
        page: {
          total: 0,
          page_size: 10,
          current: 1
        },
        mocks: [],
        form: {
          name: "",
          description: "",
          method: "get",
          response: "{}",
        },
        rules: {
          name: [
            {required: true, message: '请输入mock任务名称', trigger: 'blur'},
          ],
          description: [
            {required: false, message: '请输入mock任务描述', trigger: 'blur'},
          ],
          method: [
            {required: true, message: '请选择mock任务的方法', trigger: 'blur'},
          ],
          response: [
            {required: true, message: '请输入mock接口需要返回的json参数', trigger: 'blur'},
          ],
        },
        dialog_title: "创建mock",

        dialog_Visible: false,

        current_mock:null,


      }
    },
    methods: {
      editorInit: function () {
        require('brace/ext/language_tools') //language extension prerequsite...
        require('brace/mode/json')
        require('brace/mode/javascript')    //language
        require('brace/mode/less')
        require('brace/theme/chrome')
      },

      get_mocks_list() {
        get_mock_list().then(data => {
          if (data.success === true) {
            this.mocks = data.data;
            this.page.total = this.mocks.length
          } else {
            this.$message.error("任务列表获取失败！")
          }
        })
      },
      open_add_mock() {
        this.dialog_title = "创建mock任务";
        this.form.name = "";
        this.form.description = "";
        this.form.method = "get";
        this.form.response = "{}";
        this.current_mock=null;
        this.dialog_Visible = true;

      },
      submit_form() {
        this.$refs.form.validate((valid) => {

          try{
            JSON.parse(this.form.response)
          }catch (e) {
            this.$message.err("请输入正确json格式的response")
            return
          }
          console.log(this.form)

          if (valid) {
            if (this.current_mock === null) {
              this.add_mock_req()
            } else {
              this.update_mock_req()
            }
          } else {
            this.$message.error("请输入正确的参数！")
          }

        })

      },
      add_mock_req() {
        create_mock(this.form).then(data => {
          if (data.success === true) {
            this.$message.success("mock任务添加成功！")
            this.get_mocks_list()
            this.dialog_Visible = false
          } else {
            this.$message.error("mock任务添加失败！")
          }
        })
      },
      update_mock_req() {
        update_mock(this.current_mock.id,this.form).then(data => {
          if (data.success === true) {
            this.$message.success("mock任务编辑成功！")
            this.get_mocks_list()
            this.dialog_Visible = false
          } else {
            this.$message.error("mock任务编辑失败！")
          }
        })
      },
      open_edit_mock(mock_data) {
        this.dialog_title = "编辑mock任务"
        this.form.name = mock_data.name;
        this.form.description = mock_data.description;
        this.form.method = mock_data.method;
        this.form.response = JSON.stringify(mock_data.response);
        this.current_mock = mock_data
        this.dialog_Visible = true;
      },
      open_delete_mock(id) {
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_mock(id).then(data => {
            if (data.success === true) {
              this.$message.success("删除mock接口成功!");
              this.get_mocks_list()
            } else {
              this.$message.error("删除mock接口失败")
            }
          })
        }).catch(() => {

        })
      },
      current_change(page) {
        this.page.current = page;
      }
    },
    // created() {
    //   this.tableData=this.mocks
    // },
    created() {
      this.page.current = 1
      this.get_mocks_list()
    },
    computed: {
      page_data: function () {
        let start = (this.page.current - 1) * this.page.page_size;
        let end = this.page.total;
        if (this.page.total > this.page.page_size * this.page.current) {
          end = this.page.page_size * this.page.current
        } else {
          end = this.page.total
        }
        let ret = []
        for (let i = start; i < end; i++) {
          ret.push(this.mocks[i])
        }
        return ret

      }
    },
    watch: {
      mocks: function () {
        this.page.total = this.mocks.length
        this.page.current = 1
      }
    }

  }
</script>

<style scoped>
  .page-style {
    text-align: right;
  }

  .div-main {
    padding: 10px;
  }
</style>

