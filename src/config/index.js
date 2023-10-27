/**
 * @description 环境配置封装
 * @author 刘永奇
 */


const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
  development:{
    baseApi:'/',
    mockApi:'https://www.fastmock.site/mock/3abac6f8e01c4da4cb580aa6744502ed/api'
  },
  test:{
    baseApi:'/',
    mockApi:'https://www.fastmock.site/mock/3abac6f8e01c4da4cb580aa6744502ed/api'
  },
  prod:{
    baseApi:'/',
    mockApi:''
  }
}
export default {
  env,
  mock:true,
  namespace:'manager',
  ...EnvConfig[env]
}
