import storage from "../utils/storage";
import api from "../api";
import utils from "../utils/utils";
import { router } from ".";

// 动态路由
export async function loadAsyncRoutes() {
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
