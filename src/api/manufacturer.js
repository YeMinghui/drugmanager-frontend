import request from '@/utils/request'

export function saveManufacturer(data) {
  return request({
    url: '/manufacturer',
    method: 'post',
    data: data
  })
}

export function deleteManufacturer(data) {
  return request({
    url: '/manufacturer',
    method: 'delete',
    data: data
  })
}

export function deleteManufacturers(data) {
  return request({
    url: '/manufacturer/list',
    method: 'delete',
    data: data
  })
}

export function putManufacturer(data) {
  return request({
    url: '/manufacturer',
    method: 'put',
    data: data
  })
}

export function listManufacturers(data) {
  return request({
    url: '/manufacturer/page',
    method: 'get',
    params: data
  })
}

export function search(data) {
  return request({
    url: '/manufacturer/search',
    method: 'post',
    params: data
  })
}
