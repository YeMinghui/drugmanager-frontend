import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getInfo(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}

export function putUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user',
    method: 'delete',
    params: data
  })
}

export function deleteUsers(data) {
  return request({
    url: '/user/list',
    method: 'delete',
    data: data
  })
}

export function changePwd(data) {
  return request({
    url: '/password',
    method: 'put',
    data: data
  })
}

export function getRole(data) {
  return request({
    url: '/role',
    method: 'get',
    params: data
  })
}

export function putRole(data) {
  return request({
    url: '/role',
    method: 'put',
    data: data
  })
}

export function listUsers(data) {
  return request({
    url: '/user/page',
    method: 'get',
    params: data
  })
}

export function listRoles(data) {
  return request({
    url: '/role/page',
    method: 'get',
    params: data
  })
}

export function search(data) {
  return request({
    url: '/user/search',
    method: 'post',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}
