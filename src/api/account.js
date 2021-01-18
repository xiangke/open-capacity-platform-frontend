import request from '@/plugin/axios'

export function getuser (obj) {
  return request({
    url: '/api-user/users/users/current',
    method: 'get',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/api-user/users/me',
    method: 'put',
    data: obj
  })
}

export function putimage (obj) {
  return request({
    url: '/api-file/files/upload',
    method: 'post',
    data: obj
  })
}

export function deptList () {
  return request({
    url: '/api-user/depts/deptList',
    method: 'get'
  })
}
