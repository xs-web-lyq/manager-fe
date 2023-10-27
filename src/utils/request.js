/**
 * @description axios二次封装
 * @author 刘永奇
 */
import axios from "axios"
import config from "../config"
import {useRouter} from 'vue-router'
import { ElMessage } from "element-plus"

const router = useRouter()
const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络异常，稍后重试'

// 实例化axiox，被指全局请求配置
const instance = axios.create({
  baseURL:config.mockApi,
  withCredentials:true, //允许跨域传递，cookie(登录)
  timeout:10000
})

// 请求拦截
instance.interceptors.request.use((req)=>{
  //TO-DO
  const headers = req.headers
  // JWT--token处理
  if(!headers.Authorization) headers.Authorization = 'Liuyongqi'
  return req
})

// 响应拦截
instance.interceptors.response.use((res)=>{
  // 
  const {code,data,msg} = res.data
  if(code === 200){
    return data
  }else if(code === 4001){
    ElMessage.error(TOKEN_INVALID)
    setTimeout(()=>{
      router.push({name:'Login'})
    },10000)
    return Promise.reject(TOKEN_INVALID)
  }else{
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * 请求核心函数
 * @param {object} options  请求配置
 * @returns 
 */
function request(options){
  options.method = options.method || 'get'
  if(options.method.toLowerCase() == 'get'){
    options.params = options.data
  }
  // 当为生产环境为了安全起见，将baseURL直接复制为配置选项中baseApi
  if(config.env === 'production'){
    instance.defaults.baseURL = config.baseApi
  }
  else{
    instance.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }

  return instance(options)
}
// 为了兼容通过 .get()方法进行请求操作。在request函数对象上添加请求method并给他们赋值为函数然后request函数返回值
['get','post','delete','put','patch'].forEach((item)=>{
  request[item] = (url,data,options)=>{
    return request({
      url,
      data,
      method:item,
      ...options
    })
  }
})

export default request
