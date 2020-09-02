import {common_delete, common_get, common_post, common_put} from "./common";

let task_path="backend/task/";
//获取任务列表
export const get_task_list=function () {
  return common_get(task_path)
}

//创建任务
export const create_task=function (name,description) {
  return common_post(task_path, {"name":name,"description":description})
}

//更新任务
export const update_task=function (name,description,task_id) {
  return common_put(task_path+task_id, {"name":name,"description":description})
}

//删除任务
export const delete_task=function (task_id) {
  return common_delete(task_path + task_id)
}

//获取单个任务
export const get_task=function (task_id) {
  return common_get(task_path + task_id)
}


//获取单个任务的接口列表
export const get_task_interface=function (task_id) {
  return common_get(task_path + task_id+"/interface/")
}
//任务添加接口
export const  task_add_interface=function (task_id,data) {
  return common_post(task_path+task_id+"/interface/", data)
}

//任务移除接口
export const task_delete_interface=function (task_id,data) {
  return common_delete(task_path+task_id+"/interface/",data)
}

//任务版本列表获取接口
export const task_get_versions=function (task_id) {
  return common_get(task_path +task_id+ "/versions")
}

//任务单个版本的结果列表获取接口
export const task_get_version_result=function (version_id) {
  return common_get(task_path + "versions/"+version_id+"/results")
}

