
import {common_get,common_post,common_put} from "./common";

const url="backend/user/";

export const register=function (name,pwd) {
  return common_post(url,{"username":name,"password":pwd})

}

export const login=function (name,pwd) {
  return common_put(url, {"username":name,"password":pwd})
}


export const get_user=function () {
  return common_get(url)

}

