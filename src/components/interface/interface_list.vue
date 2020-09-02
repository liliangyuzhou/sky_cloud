<template>

  <div>
    <el-button type="primary" @click="open_add_interface" size="small">创建接口</el-button>
<!--    因为要分页，所以不能直接赋值父组件传进来的数据interfaces，需要在计算属性里面计算下，返回计算后的interfaces数据-->
    <!--      :data="interfaces"-->
    <el-table
      :data="page_data"
      style="width: 100%"
      height="510px">
      <el-table-column
        fixed
        prop="name"
        label="名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="300">
      </el-table-column>
      <el-table-column
        prop="url"
        label="URL"
        width="250">
      </el-table-column>
      <el-table-column
        prop="method"
        label="请求方法"
        width="120">
      </el-table-column>
      <el-table-column
        prop="host"
        label="域名"
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
          <el-button @click="open_edit_interface(scope.row.id)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="open_delete_interface(scope.row.id)">删除</el-button>
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
  import {delete_interface, get_service_interface} from "../../requests/interface"
  import {delete_service} from "../../requests/service";

  export default {
    name: "interface_list",
    props: ["interfaces", "service_id"],
    data() {
      return {
        // tableData:[],
        page:{
          total:0,
          page_size:10,
          current:1
        }
      }
    },
    methods: {
      open_add_interface() {
        window.open('/add/interface?service=' + this.service_id)

      },
      open_edit_interface(id) {
        window.open('/edit/interface?service=' + this.service_id + "&interface=" + id)
      },
      open_delete_interface(id) {
        this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delete_interface(id).then(data => {
            if (data.success === true) {
              //删除完成后，这里抛出一个更新的事件给父组件
              this.$emit("update",[])
              this.$message.success("删除接口成功!");
            }else{
              this.$message.error("删除接口失败")
            }
          })
        }).catch(() => {

        })
      },
      current_change(page){
        this.page.current=page;
      }
    },
    // created() {
    //   this.tableData=this.interfaces
    // },
    created() {
      this.page.total=this.interfaces.length
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
          ret.push(this.interfaces[i])
        }
        return ret

      }
    },
    watch:{
      interfaces:function () {
        this.page.total=this.interfaces.length
        this.page.current=1
      }
    }

  }
</script>

<style scoped>
  .page-style{
    text-align: right;
  }
</style>
