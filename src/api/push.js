import request from '@/plugin/axios'
export function getmessage (query) {
  return request({
    url: '/api-message/message/list',
    method: 'post',
    params: query
  })
}
export function getappid () {
  return request({
    url: '/api-user/menus/current',
    method: 'get'
  })
}
export function all () {
  return request({
    url: '/api-auth/clients/all',
    method: 'get'
  })
}
export function postsend (query) {
  return request({
    url: '/api-auth/sms/send',
    method: 'post',
    params: query
  })
}
export function getcount (query) {
  return request({
    url: '/api-message/message/count',
    method: 'post',
    params: query
  })
}