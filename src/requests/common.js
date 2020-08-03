import VueCookies from 'vue-cookies';
let host="http://127.0.0.1:8000/"

export let common_post=function (url,data) {
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

export let common_get=function (url) {
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

export let common_put=function (url,data) {
  data=JSON.stringify(data)
  return fetch(host+url,{
    method:"PUT",
    body:data,
    credentials: 'include',
    headers:{
      'token':VueCookies.get('token')
    }
  }).then(response=> {
    return response.json()
  })
}

export let common_delete=function (url) {
  return fetch(host+url,{
    method:"DELETE",
    credentials: 'include',
    headers:{
      'token':VueCookies.get('token')
    }
  }).then( response =>{
    return response.json()
  })

}


export let common_patch=function (url,data) {
  data=JSON.stringify(data)
  return fetch(host+url,{
    method:"PATCH",
    body:data,
    credentials: 'include',
    headers:{
      'token':VueCookies.get('token')
    }
  }).then(response=> {
    return response.json()
  })
}
