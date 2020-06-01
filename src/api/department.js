import request from '@/utils/request'

export function getDeparts() {
  return request({
    url: '/department/page',
    method: 'get',
    params: {page: 1, limit: 100}
  })
}

export function saveDepart(data) {
  return request({
    url: '/department',
    method: 'post',
    data: data
  })
}

export function putDepart(data) {
  return request({
    url: '/department',
    method: 'put',
    data: data
  })
}

export function deleteDepart(data) {
  return request({
    url: '/department',
    method: 'delete',
    params: data
  })
}

export function deleteDeparts(data) {
  return request({
    url: '/department/list',
    method: 'delete',
    data: data
  })
}
