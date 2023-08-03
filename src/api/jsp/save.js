import request from '@/utils/request'

// 查询试验记录列表
export function listSave(query) {
  return request({
    url: '/jsp/save/list',
    method: 'get',
    params: query
  })
}

// 查询试验记录详细
export function getSave(saveId) {
  return request({
    url: '/jsp/save/' + saveId,
    method: 'get'
  })
}

// 新增试验记录
export function addSave(data) {
  return request({
    url: '/jsp/save',
    method: 'post',
    data: data
  })
}

// 修改试验记录
export function updateSave(data) {
  return request({
    url: '/jsp/save',
    method: 'put',
    data: data
  })
}

// 删除试验记录
export function delSave(saveId) {
  return request({
    url: '/jsp/save/' + saveId,
    method: 'delete'
  })
}
