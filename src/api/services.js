import request from '@/plugin/axios'

export function findAlls () {
  return request({
    url: '/api-auth/services/findAlls',
    method: 'get'
  })
}

export function findOnes () {
  return request({
    url: '/api-auth/services/findOnes',
    method: 'get'
  })
}

export function saveOrUpdate (data) {
  return request({
    url: '/api-auth/services/saveOrUpdate',
    method: 'post',
    data
  })
}

export function deleteClient (id) {
  return request({
    url: '/api-auth/services/' + id,
    method: 'delete'
  })
}
