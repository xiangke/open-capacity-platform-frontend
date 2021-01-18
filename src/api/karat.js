import request from '@/plugin/axios'

export function getName () {
  return request({
    url: '/api-device/infiCombo/dev/devtypes',
    method: 'get'
  })
}

export function getcontrolmodel () {
  return request({
    url: '/api-device/infiCombo/model/controlmodel',
    method: 'get'
  })
}
