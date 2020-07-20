import { request } from "./request";

// 获取班级列表信息
export function getClassList() {
  return request({
    url: "/admin/grade",
    method: "get",
  });
}
// 添加年级
export function addGradeName(userForm) {
  return request({
    url: "/admin/grade",
    method: "post",
    data: userForm,
  });
}
// 根据id获取到该要修改的年级名称
export function getGradeName(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "get",
  });
}
// 修改年级名称
export function updataGrade(updataUserInfo) {
  return request({
    url: `/admin/grade`,
    method: "put",
    data: updataUserInfo,
  });
}
// 删除年级
export function delectGrade(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "delete",
  });
}

// 添加班级
export function addClassName(classForm) {
  return request({
    url: "/admin/grade",
    method: "post",
    data: classForm,
  });
}
// 根据id获取到该要修改的班级名称
export function getClassName(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "get",
  });
}
// 修改班级名称
export function updataClass(updataClassInfo) {
  return request({
    url: "/admin/grade",
    method: "put",
    data: updataClassInfo,
  });
}
// 删除班级
export function delectClass(id) {
  return request({
    url: `/admin/grade/${id}`,
    method: "delete",
  });
}

