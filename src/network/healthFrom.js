import { request } from "./request";

// 获取健康表单信息
export function getHealthFrom() {
  return request({
    url: "/admin/healthform",
    method: "get"
  });
}
// 获取柱状图信息
export function getBarInfo() {
  return request({
    url: "/admin/healthform/bar",
    method: "get"
  });
}