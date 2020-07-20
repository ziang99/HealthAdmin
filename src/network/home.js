import { request } from "./request";

// 获取菜单信息
export function getMenuList() {
  return request({
    url: "/admin/menus",
    method: "get"
  });
}