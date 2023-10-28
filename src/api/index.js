/**
 * @description api配置
 * @author 刘永奇
 */

import request from "../utils/request"
export default {
  login(params){
    return request({
      url:'/users/login',
      data:params,
      method:'post',
      mock:true
    })
  }
}