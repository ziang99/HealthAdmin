import axios from "axios";
import { MessageBox } from 'element-ui'
import Router from '@/router/index.js'

export function request(config) {
  // 1.创建axios实例
  const instance = axios.create({
    baseURL: "http://192.168.0.100:3000",
    // timeout: 5000
  });
  // 2.拦截器
  // 请求拦截器
  instance.interceptors.request.use(
    res => {
      // console.log(res)
      // 将本地存储中的 token 值存储在请求头中
      res.headers.token = window.sessionStorage.getItem('token')
      return res;
    },
    err => {
      console.log(err);
    }
  );
  // 响应拦截器
  instance.interceptors.response.use(
    res => {
      // console.log(res.data)
      if(res.data.code === 444){
        MessageBox.alert(
          "登录信息已过期，请您重新登录~",
          "提示",
          {
            type: "warning",
            confirmButtonText: "返回登录",
            callback: action => {
              if(action === 'confirm'){
                Router.replace('/login')
              }
            }
          }
        );
      }
      return res.data;
    },
    err => {
      console.log(err);
    }
  );
  // 3.发送请求
  return instance(config);
}
