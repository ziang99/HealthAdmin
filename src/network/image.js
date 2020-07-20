import { request } from "./request";

// 获取所有图片
export function getImageList(queryInfo) {
  return request({
    url: "/admin/image",
    method: "get",
    params: queryInfo
  });
}
// 删除图片
export function delImage(id) {
  return request({
    url: `/admin/image/${id}`,
    method: "delete"
  });
}
