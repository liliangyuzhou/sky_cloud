<template>

  <div class="dive-main">
    <div v-show="!is_show_task_detail">

      <el-button type="primary" @click="open_add_task" size="small">创建任务</el-button>
      <!--    因为要分页，所以不能直接赋值父组件传进来的数据tasks，需要在计算属性里面计算下，返回计算后的tasks数据-->
      <!--      :data="tasks"-->
      <el-table
        :data="page_data"
        style="width: 100%"
        height="510px">
        <el-table-column
          fixed
          prop="name"
          label="名称"
          width="150">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="show_task_detail(scope.row)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="560">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="350">
        </el-table-column>
        <el-table-column
          prop="interface_count"
          label="接口个数"
          width="120">
        </el-table-column>
        <el-table-column
          prop="result_count"
          label="结果个数"
          width="250">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="创建人"
          width="250">
        </el-table-column>
        <el-table-column
          prop="ops"
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-button @click="open_edit_task(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="open_delete_task(scope.row.id)">删除</el-button>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialog_Visible = false">取 消</el-button>
          <el-button type="primary" @click="submit_form">确 定</el-button>
        </div>
      </el-dialog>
    </div>


    <task_detail :task="select_task" v-if="is_show_task_detail" @go_back="go_back"></task_detail>

  </div>

</template>

<script>
  import {get_task, update_task, get_task_list, delete_task, create_task} from "../../requests/task";
  import task_detail from "./task_detail";

  export default {
    name: "task_list",
    components: {task_detail},
    data() {
      return {
        // tableData:[],
        page: {
          total: 0,
          page_size: 10,
          current: 1
        },
        tasks: [],
        form: {
          name: "",
          description: "",
        },
        rules: {
          name: [
            {required: true, message: '请输入任务名称', trigger: 'blur'},
          ],
          method: [
            {required: false, message: '请输入描述', trigger: 'blur'},
          ],
        },
        dialog_title: "创建任务",
        dialog_edit_type: 'add',
        edit_task_id: -1,

        dialog_Visible: false,

        select_task: {},
        is_show_task_detail: false,

      }
    },
    methods: {
      go_back(){
        this.is_show_task_detail = false;
      },
      show_task_detail(task) {
        this.select_task = task;
        this.is_show_task_detail = true

      },
      get_tasks_list() {
        get_task_list().then(data => {
          if (data.success === true) {
            this.tasks = data.data;
          } else {
            this.$message.error("任务列表获取失败！")
          }
        })
      },
      open_add_task() {
        this.dialog_title = "创建任务",
          this.dialog_edit_type = "add";
        this.form.name = "";
        this.form.description = "";
        this.dialog_Visible = true;

      },
      submit_form() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.dialog_edit_type === "add") {
              this.add_task_req()
            } else {
              this.update_task_req()
            }
          } else {
            this.$message.error("请输入正确的参数！")
          }

        })

      },
      add_task_req() {
        create_task(this.form.name, this.form.description).then(data => {
          if (data.success === true) {
            this.$message.success("任务添加成功！")
            this.get_tasks_list()
            this.dialog_Visible = false
          } else {
            this.$message.error("任务添加失败！")
          }
        })
      },
      update_task_req() {
        update_task(this.form.name, this.form.description, this.edit_task_id).then(data => {
          if (data.success === true) {
            this.$message.success("任务编辑成功！")
            this.get_tasks_list()
            this.dialog_Visible = false
          } else {
            this.$message.error("任务编辑失败！")
          }
        })
      },
      open_edit_task(task_data) {
        this.dialog_title = "编辑任务"
        this.dialog_edit_type = "edit";
        this.edit_task_id = task_data.id
        this.form.name = task_data.name;
        this.form.description = task_data.description;
        this.dialog_Visible = true;
      },
      open_delete_task(id) {
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_task(id).then(data => {
            if (data.success === true) {
              this.$message.success("删除接口成功!");
              this.get_tasks_list()
            } else {
              this.$message.error("删除接口失败")
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
    //   this.tableData=this.tasks
    // },
    created() {
      this.page.total = this.tasks.length
      this.page.current = 1
      this.get_tasks_list()
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
          ret.push(this.tasks[i])
        }
        return ret

      }
    },
    watch: {
      tasks: function () {
        this.page.total = this.tasks.length
        this.page.current = 1
      }
    }

  }
</script>

<style scoped>
  .page-style {
    text-align: right;
  }

  .dive-main {
    padding: 10px;
  }
</style>
