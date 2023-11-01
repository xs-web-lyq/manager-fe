import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: "/welcome",
    meta: {
      title: "首页",
    },
    // 子路由：当需要在当前页面通过路由跳转，切换页面中一部分页面时使用子路由，在父页面中使用router-view动态展示
    children: [
      {
        name: "Welcome",
        path: "welcome",
        meta: {
          title: "欢迎",
        },
        component: () => import("../views/Welcome.vue"),
      },
      {
        name: "User",
        path: "/system/user",
        meta: {
          title: "用户管理",
        },
        component: () => import("../views/User.vue"),
      },
      {
        name: "Menu",
        path: "/system/menu",
        meta: {
          title: "用户管理",
        },
        component: () => import("../views/Menu.vue"),
      },
      {
        name: "Role",
        path: "/system/role",
        meta: {
          title: "角色管理",
        },
        component: () => import("../views/Role.vue"),
      },
    ],
  },
  {
    name: "Login",
    path: "/login",
    // 可以添加权限
    meta: {
      title: "登录",
    },
    component: () => import("../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
