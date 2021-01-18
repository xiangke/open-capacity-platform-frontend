import request from '@/plugin/axios'

export function tokenList () {
  return request({
    url: '/api-auth/oauth/token/list',
    method: 'post'
  })
}

export function deleteToken (params) {
  return request({
    url: '/api-auth/oauth/remove/token',
    method: 'post',
    params
  })
}
