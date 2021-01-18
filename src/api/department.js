import request from '@/plugin/axios'

export function getdeptList (query) {
  return request({
    url: '/api-user/depts/deptList',
    method: 'get',
    params: query
  })
}
export function deletes (query) {
  return request({
    url: '/api-user/depts/delete',
    method: 'post',
    params: query
  })
}

export function saveOrUpdate (query) {
  return request({
    url: '/api-user/depts/saveOrUpdate',
    method: 'post',
    params: query
  })
}
