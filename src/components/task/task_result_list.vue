<template>
  <div>
    <el-select v-model="current_result" placeholder="请选择" @change=" get_version_result">
      <el-option
        v-for="item in results"
        :key="item.id"
        :label="item.version"
        :value="item.id">
        <span>{{ item.version }} -- </span>
        <span>{{ item.created }}</span>
      </el-option>
    </el-select>


    <el-table
      :data="version"
      style="width: 100%">
      <el-table-column
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {task_get_version_result,task_get_versions} from "../../requests/task";

  export default {
    name: "task_result_list",
    props:["task_id"],
    data() {
      return {
        version: [],
        results: [],
        current_result: "",
      }

    },
    created() {
      this.get_versions()
    },
    methods: {

      get_versions: function () {
        task_get_versions(this.task_id).then(data => {
          if (data.success === true) {
            this.results = data.data;
            if (this.results.length > 0) {
              this.get_version_result(this.results[0].id)
            } else {
              this.$message.error("查询接口的历史结果失败！")
            }

          }
        })
      },
      get_version_result(task_result_id) {
        task_get_version_result(task_result_id).then(data => {
          if (data.success === true) {
            this.version = data.data;
          } else {
            this.$message.error("查询接口的历史结果失败！")
          }

        })

      },
    }
  }
</script>

<style scoped>

</style>
