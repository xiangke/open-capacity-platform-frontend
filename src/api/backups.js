import request from '@/plugin/axios'

// 获取数据信息
export function queryJobDatasourceList(obj) {
    return request({
        url: '/api-backup/backup/queryJobDatasourceList',
        method: 'get',
        params: obj
    })
}

//删除数据
export function deleteBackupInfo(obj) {
    return request({
        url: '/api-backup/backup/deleteBackupInfo',
        method: 'post',
        data: obj
    })
}

// 查看数据
export function queryHistoryList(obj) {
    return request({
        url: '/api-backup/backup/queryHistoryList',
        method: 'post',
        params: obj
    })
}



//添加修改数据
export function saveOrUpdateBackupInfo(obj) {
    return request({
        url: '/api-backup/backup/saveOrUpdateBackupInfo',
        method: 'post',
        data: obj
    })
}
//连接测试
export function testJdbcUrl(obj) {
    return request({
        url: '/api-backup/backup/testJdbcUrl',
        method: 'post',
        data: obj
    })
}
//状态修改
export function updateStatus(obj) {
    return request({
        url: '/api-backup/backup/updateStatus',
        method: 'post',
        data: obj
    })
}