import request from '@/utils/request'

export function saveInventory(data) {
  return request({
    url: '/inventory',
    method: 'post',
    data: data
  })
}

export function deleteInventory(data) {
  return request({
    url: '/inventory',
    method: 'delete',
    params: data
  })
}

export function deleteInventories(data) {
  return request({
    url: '/inventory/list',
    method: 'delete',
    data: data
  })
}

export function putInventory(data) {
  return request({
    url: '/inventory',
    method: 'put',
    data: data
  })
}

export function listInventories(data) {
  return request({
    url: '/inventory/page',
    method: 'get',
    params: data
  })
}

export function listInventoryByIds(data) {
  return request({
    url: '/inventory/list',
    method: 'post',
    data: data
  })
}

export function listInventoryHist(data) {
  return request({
    url: '/inventoryChange/page',
    method: 'get',
    params: data
  })
}


export function search(data) {
  return request({
    url: '/inventory/search',
    method: 'post',
    params: data
  })
}

export function searchHist(data) {
  return request({
    url: '/inventoryChange/search',
    method: 'post',
    params: data
  })
}
