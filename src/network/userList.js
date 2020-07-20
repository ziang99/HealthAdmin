import { request } from "./request"

// 获取用户列表信息
export function getUserList () {
  return request({
    url: "/admin/user",
    method: "get"
  })
}
// 删除管理员
export function delectUser(id) {
  return request({
    url: `/admin/user/${id}`,
    method: "delete"
  });
}