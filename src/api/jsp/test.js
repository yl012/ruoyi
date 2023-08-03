import request from '@/utils/request'

// 查询试验管理列表
export function listTest(query) {
  return request({
    url: '/jsp/test/list',
    method: 'get',
    params: query
  })
}

// 查询试验管理详细
export function getTest(testId) {
  return request({
    url: '/jsp/test/' + testId,
    method: 'get'
  })
}

// 新增试验管理
export function addTest(data) {
  return request({
    url: '/jsp/test',
    method: 'post',
    data: data
  })
}

// 修改试验管理
export function updateTest(data) {
  return request({
    url: '/jsp/test',
    method: 'put',
    data: data
  })
}

// 删除试验管理
export function delTest(testId) {
  return request({
    url: '/jsp/test/' + testId,
    method: 'delete'
  })
}
