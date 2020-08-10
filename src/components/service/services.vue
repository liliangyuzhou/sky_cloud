<template>
  <div class="service-main">
    <div class="service-tree">
      <el-button type="primary" @click="add_root_service" size="small">创建根服务</el-button>
      <el-tree
        :props="default_Props"
        class="tree-padding"
        :data="service_tree"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
<!--        这里slot-scope的data就是父节点的data-->
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
         <el-dropdown @command="handle_command">
            <span class="el-dropdown-link">
             <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-circle-plus" :command="{'ops':'add','data':data}">创建</el-dropdown-item>
              <el-dropdown-item icon="el-icon-edit-outline" :command="{'ops':'edit','data':data}">编辑</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete" :command="{'ops':'delete','data':data}">删除</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </span>
      </el-tree>
    </div>


    <div class="interface-tree">
      列表内容
    </div>

    <el-dialog :title="edit_service.title" :visible.sync="edit_service.dialog_Visible" width="35%">
      <el-form :model="edit_service"  label-width="80px" :rules="edit_service_rule" ref="edit_service" label-position="left">
        <el-form-item label="父服务" prop="parent" v-if="edit_service.parent !=0">
          {{ edit_service.parent_name }}
        </el-form-item>
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="edit_service.name"></el-input>
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input v-model="edit_service.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit_service.dialog_Visible = false">取 消</el-button>
        <el-button type="primary" @click="submit_form">确 定</el-button>
      </div>
    </el-dialog>



  </div>

</template>

<script>
  import {create_service,update_service,delete_service,get_service_tree,get_service} from "../../requests/service";

  export default {
    name: "services",
    data() {
      return {
        service_tree: [],
        default_Props: {
          label: 'name',
        },

        edit_service:{
          dialog_Visible:false,
          title:"创建服务",
          name:"",
          description: "",

          parent:0,
          parent_name:"",

          //编辑的时候使用
          mode:"add",
          id:-1,

        },

        edit_service_rule: {
          name: [
            {required: true, message: '请输入服务名称', trigger: 'blur'},
            {min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur'}
          ],
          description: [
            {required: false, message: '请输入描述', trigger: 'blur'},
          ],
        }

      }
    },

    methods:{
      get_service_func() {
        get_service_tree().then(data=>{
          if (data.success===true){
            this.service_tree=data.data
          }else{
            this.$message.error(data.message)
          }
        })
      },

      submit_form(){
        this.$refs.edit_service.validate((valid) => {
          if(valid){
            if (this.edit_service.mode==="add"){
              this.add_service_req();
            }else{
              this.update_service_req();
            }

          }

        });

      },

      add_root_service(){
        this.edit_service.dialog_Visible=true;
        this.edit_service.mode="add";
        this.edit_service.name="";
        this.edit_service.description="";
        this.edit_service.title="创建服务";
        this.edit_service.parent=0;
        this.edit_service.parent_name="";
        this.edit_service.id=-1;
      },
      add_chlidren_service(parent_data){
        //和父服务很像，除了id和name不一样，所以这里重新给这两个字段赋值就好
        this.add_root_service();
        this.edit_service.parent=parent_data.id;
        this.edit_service.parent_name=parent_data.name;
      },

     edit_root_service(data){
        this.edit_service.dialog_Visible=true;
        this.edit_service.mode="edit";
        this.edit_service.name=data.name;
        this.edit_service.description=data.description;
        this.edit_service.title="编辑服务";
        this.edit_service.parent=data.parent;
        this.edit_service.parent_name=data.parent;
        this.edit_service.id=data.id;
      },

      delete_children_service(service_id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { delete_service(service_id).then(data=>{
          if(data.success===true){
            this.$message.success("删除服务成功!");
            this.get_service_func()

          }else{
            return this.$message.error("data.message")
          }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },


      add_service_req(){
        create_service(this.edit_service.name,this.edit_service.description,this.edit_service.parent).then(resp=>{
          if(resp.success===true){
            this.$message.success("创建服务成功!");
            this.edit_service.dialog_Visible=false;
            this.get_service_func();
          }else{
            return this.$message.error("resp.message")
          }
        });
      },

      update_service_req(){
        update_service(this.edit_service.id,this.edit_service.name,this.edit_service.description,this.edit_service.parent).then(resp=>{
          if(resp.success===true){
            this.$message.success("编辑服务成功!");
            this.edit_service.dialog_Visible=false;
            this.get_service_func();
          }else{
            return this.$message.error("resp.message")
          }
        });
      },

      handle_command(command){
          let ops=command.ops;
          let data=command.data;
          switch(ops){
            case "add":
              this.add_chlidren_service(data);
              this.get_service_func();
              break;
            case "delete":
              this.delete_children_service(data.id);
              break;
            case "edit":
              this.edit_root_service(data);
              this.get_service_func();
              break;


        }
      },


    },

    mounted() {
      this.get_service_func();
    },
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
