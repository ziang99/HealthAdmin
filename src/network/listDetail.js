import { request } from "./request";

// 获取列表数据信息
export function getListDetail(queryInfo) {
  return request({
    url: "/admin/listdetail",
    method: "get",
    params: queryInfo
  });
}
// 获取父级类目信息
export function getCategory() {
  return request({
    url: "/admin/listdetail/category",
    method: "get",
  });
}
// 添加信息详情
export function addListDetail(userForm) {
  return request({
    url: "/admin/listdetail",
    method: "post",
    data: userForm,
  });
}
// 添加信息时的图片上传
export function addListDetailImgae(file) {
  return request({
    url: "/admin/image/upload",
    method: "post",
    data: file,
  });
}


// 根据id获取到该要修改的信息的信息
export function getDetail(id) {
  return request({
    url: `/admin/listdetail/${id}`,
    method: "get",
  });
}
// 修改信息
export function updataDetail(updataUserInfo) {
  return request({
    url: `/admin/listdetail`,
    method: "put",
    data: updataUserInfo
  });
}
// 删除信息
export function delectDetail(id) {
  return request({
    url: `/admin/listdetail/${id}`,
    method: "delete"
  });
}
// 删除图片
export function delImage(id) {
  return request({
    url: `/admin/image/${id}`,
    method: "delete"
  });
}

