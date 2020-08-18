import {common_delete, common_get, common_post, common_put} from "./common";
//创建接口
let debug_path="backend/debug/"
export const debug_interface=function (data) {
  return common_post(debug_path,data)
}
