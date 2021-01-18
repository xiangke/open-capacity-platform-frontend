import request from '@/plugin/axios'

export function getqueryMonitorInfo () {
  return request({
    url: '/api-monitor/monitor/queryMonitorInfo',
    method: 'post'
  })
}



// export function getqueryMonitorInfo () {
//   return request({
//     url: '/api-monitor/monitor/queryMonitorInfo',
//     method: 'post'
//   })
// }