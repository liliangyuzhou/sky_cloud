<template>
  <div class="div-main">
    <div>
      <el-button type="primary" @click="go_back" size="small">返回</el-button>
      <el-button type="primary" size="small">执行</el-button>
    </div>

    <div class="task-info-class">
      <div class="task-info-padding" style="margin-right: 500px">
        <div>
          <div class="task-info-padding">名 称：{{task.name}}</div>
          <div class="task-info-padding">描 述：{{task.description}}</div>
          <div class="task-info-padding">
            状 态：<span style="color: red">{{task.status}}</span>
          </div>
        </div>
      </div>

      <div class="task-info-desc task-info-class task-info-padding">
        <div class="result-padding">
          上次结果：
        </div>
        <div>
          <div class="task-info-class task-info-padding">
            <div class="result-label">total：</div>
            <div style="color: red"> {{task.last_result.total}}</div>
          </div>

          <div class="task-info-class task-info-padding">
            <div class="result-label">success：</div>
            <div style="color: red"> {{task.last_result.success}}</div>
          </div>

          <div class="task-info-class task-info-padding">
            <div class="result-label">failed：</div>
            <div style="color: red"> {{task.last_result.failed}}</div>
          </div>
        </div>

      </div>
    </div>



    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="接口列表" name="interfaces">
        <el-button type="primary" size="small" @click="show_select_interface=true">添加接口</el-button>
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
              <a href="javascript:void(0)" @click="open_edit_task(scope.row)">{{ scope.row.name }}</a>
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
            prop="result"
            label="上次结果"
            width="250">
          </el-table-column>
          <el-table-column
            prop="ops"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small" @click="open_delete_task(scope.row.task_interface_id)">删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="结果列表" name="results">
        <task_result_list :task_id="task.id" v-if="activeName==='results'"></task_result_list>
      </el-tab-pane>
    </el-tabs>

    <task_select_interfaces v-if="show_select_interface" @cancel="cancel_selelct_interface_dialog" @success="success_select_interface_dialog"></task_select_interfaces>


  </div>
</template>
<script>
  import {get_task_interface, task_add_interface, task_delete_interface} from "../../requests/task";
  import task_select_interfaces from "./task_select_interfaces"
  import task_result_list from "./task_result_list"

  export default {
    name: "task_detail",
    props: ['task'],//任务的详细数据是由外面传递进来的：id，name，description等等
    components:{task_select_interfaces,task_result_list},
    data() {
      return {
        page: {
          total: 0,
          page_size: 10,
          current: 1
        },
        interfaces: [],
        activeName: 'interfaces',

        show_select_interface:false,
      }
    },
    methods: {
      open_edit_task(data){
          window.open("/edit/interface?services="+data.service+'&interface='+data.id)
      },
      open_delete_task(id){
        task_delete_interface(this.task.id,{task_interface_id:id}).then(data=>{
          if(data.success===true){
            this.$message.info("该任务下的接口移除成功！")
            this.get_task_interface_list()
          }else{
            this.$message.error("该任务下的接口移除失败！")
          }
        })


      },
      success_select_interface_dialog(select_interfaces){
        this.show_select_interface=false;
        // console.log(select_interfaces)
        let req=[];
        for(let i=0;i<select_interfaces.length;i++){
          // console.log(select_interfaces[i])
          req.push(select_interfaces[i].id)
        }
        console.log(req)
        task_add_interface(this.task.id,{interfaces:req}).then(data=>{
          if(data.success===true){
            this.get_task_interface_list()
          }else{
            this.$message.error("添加任务接口失败！")
          }
        })
      },
      cancel_selelct_interface_dialog(){
        this.show_select_interface=false;

      },
      handleClick(tab, event) {
        console.log(tab, event);
        //回调函数，可写可不写，每点一次切换按钮，刷新一下接口列表
        let name=tab.name;
        switch (tab.name) {
          case "interfaces":
            this.get_task_interface_list()
            break
          case "results":
            break
        }
      },
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
  .task-info-class {
    display: flex;
    /*display:inline;*/
    /*float: left;*/
  }

  .task-info-name {
    width: 60%;

  }

  .task-info-desc {
    width: 60%;
  }

  .task-info-padding {
    padding: 10px 0px;
  }

  .result-padding {
    padding-top: 10px;

  }

  .result-label {
    width: 80px;

  }

  .div-main {
    padding: 10px;
  }

</style>
