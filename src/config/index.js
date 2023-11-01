/**
 * @description 环境配置封装
 * @author 刘永奇
 */


const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
  development:{
    baseApi:'/api',
    mockApi:'https://www.fastmock.site/mock/b846b9ca901d017a72546d2589b4eb0d/api'
  },
  test:{
    baseApi:'/api',
    mockApi:'https://www.fastmock.site/mock/b846b9ca901d017a72546d2589b4eb0d/api'
  },
  prod:{
    baseApi:'/api',
    mockApi:''
  }
}
export default {
  env,
  mock:false,
  namespace:'manager',
  ...EnvConfig[env]
}
