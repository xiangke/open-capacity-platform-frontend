import request from '@/plugin/axios'

export function memoryInfo () {
  return request({
    url: '/api-auth/redis/memoryInfo',
    method: 'get'
  })
}

export function keysSize () {
  return request({
    url: '/api-auth/redis/keysSize',
    method: 'get'
  })
}
