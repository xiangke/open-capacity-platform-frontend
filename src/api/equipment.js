import request from '@/plugin/axios'

export function getdeviceInfoLists (query) {
  return request({
    url: '/api-device/deviceinfo/deviceInfoList',
    method: 'post',
    params: query
  })
}

export function reportdata (obj) {
  return request({
    url: '/api-device/reportdata',
    method: 'post',
    params: obj
  })
}

export function addSave (obj) {
  return request({
    url: '/api-device/deviceinfo/save',
    method: 'post',
    params: obj
  })
}

export function deleteDeviceInfoById (obj) {
  return request({
    url: '/api-device/deviceinfo/deleteDeviceInfoById/',
    method: 'post',
    params: obj
  })
}
export function getdeviceTypeList (obj) {
  return request({
    url: '/api-device/devicetype/deviceTypeList',
    method: 'post',
    params: obj
  })
}

export function update (obj) {
  return request({
    url: '/api-device/deviceinfo/update',
    method: 'post',
    params: obj
  })
}
