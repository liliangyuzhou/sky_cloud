<template>
  <div class="dive-main">
    <div>
      <el-button type="primary" @click="go_back" size="small">返回</el-button>
      <el-button type="primary" size="small">执行</el-button>
    </div>

    <div class="task-info-class task-info-padding">
      <div class="task-info-name">名称：{{task.name}}</div>
      <div class="task-info-desc">描述：{{task.description}}</div>
    </div>
    <div class="task-info-padding" >
      状态：<span style="color: red">{{task.status}}</span>
    </div>

    <el-button type="primary" size="small">添加接口</el-button>
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
          <a href="javascript:void(0)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="560">
      </el-table-column>
      <el-table-column
        prop="url"
        label="URL"
        width="350">
      </el-table-column>
      <el-table-column
        prop="method"
        label="方法"
        width="120">
      </el-table-column>
      <el-table-column
        prop="host"
        label="域名"
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
  </div>
</template>
<script>
  import {get_task_interface, task_add_interface, task_delete_interface} from "../../requests/task";

  export default {
    name: "task_detail",
    props: ['task'],//任务的详细数据是由外面传递进来的：id，name，description等等
    data() {
      return {
        page: {
          total: 0,
          page_size: 10,
          current: 1
        },
        interfaces: [],
      }
    },
    methods: {
      go_back() {
        this.$emit("go_back")
      },
      get_task_interface_list() {
        get_task_interface(this.task.id).then(data => {
          if (data.success === true) {
            this.interfaces = data.data;
          } else {
            this.$message.error("该任务的接口列表获取失败！")
          }
        })

      },
      current_change(page) {
        this.page.current = page;
      }
    },

    created() {
      // this.page.total = this.interfaces.length;
      this.page.current = 1;
      this.get_task_interface_list();

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
          ret.push(this.interfaces[i])
        }
        return ret

      }
    },
    watch: {
      interfaces: function () {
        this.page.total = this.interfaces.length
        this.page.current = 1
      }
    }
  }
</script>

<style scoped>
  .task-info-class{
display: flex;
  }
  .task-info-name{
    width: 60%;

  }
  .task-info-desc{
    width: 60%;
  }
  .task-info-padding{
    padding: 10px 0px;
  }

</style>
