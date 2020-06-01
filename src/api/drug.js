import request from '@/utils/request'

export function getDrugInfo(data) {
  return request({
    url: '/drugDetail',
    method: 'get',
    params: data
  })
}

export function putDrug(data) {
  return request({
    url: '/drugDetail',
    method: 'put',
    data: data
  })
}

export function saveDrug(data) {
  return request({
    url: '/drugDetail',
    method: 'post',
    data: data
  })
}

export function listDrugs(data) {
  return request({
    url: '/drugDetail/page',
    method: 'get',
    params: data
  })
}

export function listDrugsByIds(data) {
  return request({
    url: '/drugDetail/list',
    method: 'post',
    data: data
  })

}

export function deleteDrugs(data) {
  return request({
    url: '/drugDetail/list',
    method: 'delete',
    data: data
  })
}

export function search(data) {
  return request({
    url: '/drugDetail/search',
    method: 'post',
    params: data
  })
}
