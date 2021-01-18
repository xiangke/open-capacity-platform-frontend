import request from '@/plugin/axios'

export function files (query) {
  return request({
    url: '/api-file/files',
    method: 'get',
    params: query
  })
}

export function deletes (query) {
  return request({
    url: '/api-file/delete',
    method: 'post',
    params: query
  })
}
