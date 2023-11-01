/**
 * @description api配置
 * @author 刘永奇
 */

import request from "../utils/request";
export default {
  login(params) {
    return request({
      url: "/users/login",
      data: params,
      method: "post",
      mock: false,
    });
  },
  noticeCount(params) {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: true,
    });
  },
  getMenuList(params) {
    return request({
      url: "/menu/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  getUserList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  userDel(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      mock: false,
    });
  },
  getRoleAllList(params) {
    return request({
      url: "/roles/allList",
      method: "get",
      data: params,
      mock: true,
    });
  },
  getRoleList(params) {
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
      mock: true,
    });
  },
  getDeptList() {
    return request({
      url: "/dept/list",
      method: "get",
      data: {},
      mock: true,
    });
  },
  userSubmit(params) {
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  menuSubmit(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
};
