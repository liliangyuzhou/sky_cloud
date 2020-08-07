import {common_delete, common_get, common_post, common_put} from "./common";

let service_path="backend/service/";
//获取服务的树形结构
export const get_service_tree=function () {
  return common_get(service_path)
}

//创建服务
export const create_service=function (name,description,parent) {
  return common_post(service_path,{"name":name,"description":description,"parent":parent})
}

//更新服务
export const update_service=function (service_id,name,description,parent) {
  return common_put(service_path+service_id, {"name":name,"description":description,"parent":parent})
}

//删除服务
export const delete_service=function (service_id) {
  return common_delete(service_path + service_id)
}


//获取单个服务
export const get_service=function (service_id) {
  return common_get(service_path + service_id)
}





