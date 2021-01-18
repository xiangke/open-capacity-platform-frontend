import request from '@/plugin/axios'

export function getlist (query) {
  return request({
    url: '/api-file/module/list',
    method: 'post',
    data: query
  })
}

export function pstdelete (query) {
  return request({
    url: '/api-file/module/delete',
    method: 'post',
    params: query
  })
}

export function addsave (query) {
  return request({
    url: '/api-file/module/save',
    method: 'post',
    data: query
  })
}

export function pupdate (query) {
  return request({
    url: '/api-file/module/update',
    method: 'post',
    data: query
  })
}

export function deletes (query) {
  return request({
    url: '/api-file/delete',
    method: 'post',
    params: query
  })
}
