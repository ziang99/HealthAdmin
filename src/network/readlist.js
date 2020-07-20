import { request } from "./request";

// 获取阅读列表信息
export function getReadList() {
  return request({
    url: "/admin/readList",
    method: "get",
  });
}
// 添加类目
export function addReadName(userForm) {
  return request({
    url: "/admin/readList",
    method: "post",
    data: userForm,
  });
}
// 根据id获取到该要修改的类目名称
export function getReadName(id) {
  return request({
    url: `/admin/readList/${id}`,
    method: "get",
  });
}
// 修改类目名称
export function updataRead(updataUserInfo) {
  return request({
    url: `/admin/readList`,
    method: "put",
    data: updataUserInfo,
  });
}
// 删除类目
export function delectRead(id) {
  return request({
    url: `/admin/readList/${id}`,
    method: "delete",
  });
}

