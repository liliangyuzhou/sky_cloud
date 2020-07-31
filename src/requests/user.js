import VueCookies from 'vue-cookies';
let host="http://127.0.0.1:8000/"


let common_post=function (url,data) {
  data=JSON.stringify(data)
  return fetch(host+url,{
    method:"POST",
    body:data,
    credentials: 'include',
    headers:{
      'token':VueCookies.get('token')
    }
  }).then(response=> {
    return response.json()
  })
}

export const register=function (name,pwd) {
  return common_post("backend/user/register",{"name":name,"pwd":pwd})

}

export const login=function (name,pwd) {
  return common_post("backend/user/login", {"name": name, "pwd": pwd})
}

let common_get=function (url) {
  return fetch(host+url,{
    method:"GET",
    credentials: 'include',
    headers:{
      'token':VueCookies.get('token')
    }
  }).then( response =>{
   return response.json()
  })

}

export const get_user=function () {
  return common_get("backend/user/get_user")

}

