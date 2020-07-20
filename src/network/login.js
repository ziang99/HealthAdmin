import { request } from "./request"

export function getLogin (username, password) {
  return request({
    url: "/admin/login",
    method: "post",
    data: { username, password }
  })
}