import request from '@/utils/request'

// 查询聊天记录列表
export function listChat(query) {
  return request({
    url: '/public/list',
    method: 'get',
    params: query
  })
}

// 查询聊天记录详细
export function getChat(chatId) {
  return request({
    url: '/jsp/chat/' + chatId,
    method: 'get'
  })
}

// 新增聊天记录
export function addChat(data) {
  return request({
    url: '/public/add',
    method: 'post',
    data: data
  })
}

// 修改聊天记录
export function updateChat(data) {
  return request({
    url: '/jsp/chat',
    method: 'put',
    data: data
  })
}

// 删除聊天记录
export function delChat(chatId) {
  return request({
    url: '/jsp/chat/' + chatId,
    method: 'delete'
  })
}
