import request from '@/plugin/axios'

// export function fetchList (query) {
//   return request({
//     url: '/api-user/permissions/findPermissions',
//     method: 'get',
//     params: query
//   })
// }

// export function fetchTree () {
//   return request({
//     url: '/api-user/permissions/preMenus',
//     method: 'get'
//   })
// }

export function queryDisplayInfo() {
    return request({
        url: '/api-display/display/queryDisplayInfo',
        method: 'post',
    })
}

// 添加数据
export function saveOrUpdateDisplayInfo(obj) {
    return request({
        url: '/api-display/display/saveOrUpdateDisplayInfo',
        method: 'post',
        data: obj
    })
}

// 获取数据库信息
export function queryDatabases() {
    return request({
        url: '/api-display/display/queryDatabases',
        method: 'get',
    })
}

export function queryTablesByDbname(obj) {
    return request({
        url: '/api-display/display/queryTablesByDbname',
        method: 'get',
        params: obj
    })
}

export function queryDataInfo(obj) {
    return request({
        url: '/api-display/display/queryDataInfo',
        method: 'post',
        params: obj
    })
}

export function queryColumnsByTableName(obj) {
    return request({
        url: '/api-display/display/queryColumnsByTableName',
        method: 'get',
        params: obj
    })
}


// 删除数据
export function deleteDisplayInfo(id) {
    return request({
        url: '/api-display/display/deleteDisplayInfo/'+id,
        method: 'get'
    })
}




