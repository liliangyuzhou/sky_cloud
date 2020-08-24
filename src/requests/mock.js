import {common_delete, common_get, common_post, common_put} from "./common";

let mock_path="backend/mock/";
//获取mock任务列表
export const get_mock_list=function () {
  return common_get(mock_path)
}

//创建mock任务
export const create_mock=function (data) {
  return common_post(mock_path, data)
}

//更新mock任务
export const update_mock=function (mock_id,data) {
  return common_put(mock_path+mock_id, data)
}

//删除mock任务
export const delete_mock=function (mock_id) {
  return common_delete(mock_path + mock_id)
}


