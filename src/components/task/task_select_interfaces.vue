<template>

  <el-dialog
    title="添加内容"
    :visible.sync="dialogVisible"
    width="50%"
    @close="cancel">
    <div class="service-main">
      <div class="service-tree">
        <el-tree
          draggable
          @node-click="select_service"
          :props="default_Props"
          class="tree-padding"
          :data="service_tree"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <!--        这里slot-scope的data就是父节点的data-->
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
      </span>
        </el-tree>
      </div>


      <div class="interface-tree">
        <el-table
          :data="page_data"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          height="510px">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed
            prop="name"
            label="名称"
            width="150">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            width="200">
          </el-table-column>
          <el-table-column
            prop="url"
            label="URL"
            width="100">
          </el-table-column>
          <el-table-column
            prop="method"
            label="请求方法"
            width="150">
          </el-table-column>
          <el-table-column
            prop="host"
            label="域名"
            width="100">
          </el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
            width="100">
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

    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
  </el-dialog>


</template>

<script>
  import {get_service_tree,get_service_interface} from "../../requests/service";
  // import interfaces from "../interface/interface";
  import interface_list from "../interface/interface_list";
  export default {
    name: "task_select_interfaces",
    // props:{interfaces},
    components:{interface_list},
    data() {
      return {
        service_tree: [],
        default_Props: {
          label: 'name',
        },
        service_interfaces:[],
        service_id:1,
        multipleSelection:[],
        page:{
          total:0,
          page_size:10,
          current:1
        },
        dialogVisible:true

      }
    },

    methods:{
      //更新事件，update是子组件interface_list监听父组件的一个方法，每当子组件监听的这个update属性发生变化，父组件会捕捉这个事件来进行相应的操作
      update_service_interface(){
        this.get_interfaces_func()
      },
      confirm(){
        this.$emit('success',this.multipleSelection);

      },
      cancel(){
        this.$emit("cancel")
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      get_service_func() {
        get_service_tree().then(data=>{
          if (data.success===true){
            this.service_tree=data.data
          }else{
            this.$message.error(data.message)
          }
        })
      },

      select_service(data){
        this.service_id=data.id
        this.get_interfaces_func()
      },
      get_interfaces_func(){
        get_service_interface(this.service_id).then(data=>{
          if(data.success===true){
            this.service_interfaces=data.data
          }
        })

      },
      current_change(page){
        this.page.current=page;
      }

    },

    mounted() {
      this.get_service_func();
    },

    created() {
      this.page.total=this.service_interfaces.length
      this.page.current=1
    },
    computed:{
      page_data:function () {
        let start=(this.page.current-1)*this.page.page_size;
        let end=this.page.total;
        if(this.page.total>this.page.page_size*this.page.current){
          end=this.page.page_size*this.page.current
        }else{
          end=this.page.total
        }
        let ret=[]
        for(let i=start;i<end;i++){
          ret.push(this.service_interfaces[i])
        }
        return ret

      }
    },
    watch:{
      service_interfaces:function () {
        this.page.total=this.service_interfaces.length
        this.page.current=1
      }
    }
  }
</script>

<style scoped>
  .service-main {
    display: flex;
  }

  .service-tree {
    width: 15%;
    border-right: solid 1px lightblue;
    padding: 10px 10px 0px 5px;
    min-height: 500px;
  }

  .tree-padding {
    padding-top: 10px;
  }

  .interface-tree {
    width: 85%;
    padding: 10px 5px 0px 10px;
  }


</style>
