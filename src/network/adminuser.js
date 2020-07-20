import { request } from "./request";

// 获取管理员列表信息
export function getAdminUserList(queryInfo) {
  return request({
    url: "/admin/adminuser",
    method: "get",
    params: queryInfo
  });
}
// 添加管理员
export function addAdminUserList(userForm) {
  return request({
    url: "/admin/adminuser",
    method: "post",
    data: userForm,
  });
}
// 根据id获取到该要修改的管理员的信息
export function getAdminUser(id) {
  return request({
    url: `/admin/adminuser/${id}`,
    method: "get",
  });
}
// 修改管理员
export function updataAdminUser(updataUserInfo) {
  return request({
    url: `/admin/adminuser`,
    method: "put",
    data: updataUserInfo
  });
}
// 删除管理员
export function delectAdminUser(id) {
  return request({
    url: `/admin/adminuser/${id}`,
    method: "delete"
  });
}