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

