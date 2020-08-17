import {common_delete, common_get, common_post, common_put} from "./common";

let interface_path="backend/interface/";
//获取接口列表
export const get_interface_list=function () {
  return common_get(interface_path)
}

//创建接口
export const create_interface=function (data) {
  return common_post(interface_path,data)
}

//更新接口
export const update_interface=function (data,interface_id) {
  return common_put(interface_path+interface_id, data)
}

//删除接口
export const delete_interface=function (interface_id) {
  return common_delete(interface_path + interface_id)
}


//获取单个接口
export const get_interface=function (interface_id) {
  return common_get(interface_path + interface_id)
}

