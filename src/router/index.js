import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";
import storage from "../utils/storage";
import api from "../api";
import utils from "../utils/utils";
import { ElMessage } from "element-plus";
import store from "../store/index.js";

const components = import.meta.glob("./../views/*.vue");

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
  // console.log(1111)
  let userInfo = storage.getItem("userInfo") || {};
  // console.log(userInfo)
  if (userInfo.token) {
    try {
      const menuList = storage.getItem("menuList");
      // debugger
      // console.log(menuList)
      let routes = utils.generateRoute(menuList);

      routes.map((route) => {
        const componentPath = `../views/${route.component}.vue`;
        const componentModule = components[componentPath] || null;

        if (componentModule) {
          route.component = componentModule;
          router.addRoute("Home", route);
        }
      });
    } catch (err) {
      return err;
    }
  }
}
const p1 = new Promise((resolve, reject) => {
  loadAsyncRoutes().then((res) => {
    resolve(res);
  });
});

p1.then((res) => {
  console.log("动态路由配置成功", res);
}).catch((err) => {
  console.log("动态路由配置失败");
});

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
  // console.log(store);
  if (!store.state.userInfo.token && to.name != "Login") {
    ElMessage({
      message: "亲你还没有登陆哦！请先登陆再访问哟✨✨✨",
      type: "warning",
    });
    router.push("/login");
    return;
  }
  if (router.hasRoute(to.name)) {
    // 有权限则将标签页title进行改变路由meta中的title--->并进入页面
    document.title = to.meta.title;
    next();
  } else {
    next("/404");
  }
});

export default router;
