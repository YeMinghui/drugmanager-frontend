import request from '@/utils/request'

export function saveSupplier(data) {
  return request({
    url: '/supplier',
    method: 'post',
    data: data
  })
}

export function deleteSupplier(data) {
  return request({
    url: '/supplier',
    method: 'delete',
    data: data
  })
}

export function deleteSuppliers(data) {
  return request({
    url: '/supplier/list',
    method: 'delete',
    data: data
  })
}

export function putSupplier(data) {
  return request({
    url: '/supplier',
    method: 'put',
    data: data
  })
}

export function listSuppliers(data) {
  return request({
    url: '/supplier/page',
    method: 'get',
    params: data
  })
}

export function search(data) {
  return request({
    url: '/supplier/search',
    method: 'post',
    params: data
  })
}
