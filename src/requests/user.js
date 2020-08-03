
import {common_get,common_post,common_put} from "./common";


export const register=function (name,pwd) {
  return common_post("backend/user/",{"username":name,"password":pwd})

}

export const login=function (name,pwd) {
  return common_put("backend/user/", {"username":name,"password":pwd})
}


export const get_user=function () {
  return common_get("backend/user/")

}

