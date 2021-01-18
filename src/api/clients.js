import request from '@/plugin/axios'

export function clients (data) {
  return request({
    url: '/api-auth/clients',
    method: 'get',
    params: data
  })
}

export function updateEnabled (data) {
  return request({
    url: '/api-auth/clients/updateEnabled',
    method: 'put',
    data: data
  })
}

export function saveOrUpdate (data) {
  return request({
    url: '/api-auth/clients/saveOrUpdate',
    method: 'post',
    data: data
  })
}

export function deleteClient (id) {
  return request({
    url: '/api-auth/clients/' + id,
    method: 'delete'
  })
}

export function showClient (id) {
  return request({
    url: '/api-auth/services/' + id + '/services',
    method: 'get'
  })
}

export function granted (data) {
  return request({
    url: '/api-auth/services/granted',
    method: 'post',
    data
  })
}
