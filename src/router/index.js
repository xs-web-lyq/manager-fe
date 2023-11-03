import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";
import storage from "../utils/storage";
import api from "../api";
import utils from "../utils/utils";

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
      // {
      //   name: "User",
      //   path: "/system/user",
      //   meta: {
      //     title: "用户管理",
      //   },
      //   component: () => import("../views/User.vue"),
      // },
      // {
      //   name: "Menu",
      //   path: "/system/menu",
      //   meta: {
      //     title: "菜单管理",
      //   },
      //   component: () => import("../views/Menu.vue"),
      // },
      // {
      //   name: "Role",
      //   path: "/system/role",
      //   meta: {
      //     title: "角色管理",
      //   },
      //   component: () => import("../views/Role.vue"),
      // },
      // {
      //   name: "Dept",
      //   path: "/system/dept",
      //   meta: {
      //     title: "部门管理",
      //   },
      //   component: () => import("../views/Dept.vue"),
      // },
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
  {
    name: "404",
    path: "/404",
    // 可以添加权限
    meta: {
      title: "页面找不到",
    },
    component: () => import("../views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 动态路由
async function loadAsyncRoutes() {
  let userInfo = storage.getItem("userInfo") || {};
  if (userInfo.token) {
    try {
      const { menuList } = await api.getPermissionList();
      let routes = utils.generateRoute(menuList);
      routes.map((route) => {
        if (route.component) {
          let url = `../views/${route.component}.vue`;
          route.component = () => import(url);
          router.addRoute("Home", route);
        }
      });
    } catch (err) {}
  }
}
await loadAsyncRoutes();

// 判断当前前往地址是否可以访问
// function checkPermission(path) {
//   let hasPermission = router
//     .getRoutes()
//     .filter((route) => route.path == path).length;
//   if (hasPermission) {
//     return true;
//   }
//   return false;
// }

// 路由守卫
router.beforeEach((to, from, next) => {
  if (router.hasRoute(to.name)) {
    // 有权限则将标签页title进行改变路由meta中的title--->并进入页面
    document.title = to.meta.title;
    next();
  } else {
    next("/404");
  }
});

export default router;
