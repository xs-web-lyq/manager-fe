import { createApp } from "vue";
// import './style.css'
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import request from "./utils/request";
import storage from "./utils/storage";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import api from "./api";
import store from "./store";

// 引入自定义插件
import Rockt from "./../packages/index";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 定义全局指令
app.directive("has", {
  beforeMount: (el, binding) => {
    // 获取按钮权限
    let userAction = storage.getItem("actionList");
    // binding上有自定义指令绑定的方法和值
    let value = binding.value;
    // 检查权限列表中是否存在自定义指令绑定的按钮值
    let hasPermission = userAction.includes(value);
    // 如果绑定的按钮此用户没有权限访问则将其删除
    if (!hasPermission) {
      el.style = "display:none";
      // 因为此时在beforeMount，组件还没有挂载到页面在VDOM中使用同步删除无法完成，所以添加一个宏任务当生命周期完成之后进行删除
      setTimeout(() => {
        // 原生DOM语法,先获取到但删除节点的父节点，通过romveChild删除子节点el
        el.parentNode.removeChild(el);
      }, 0);
    }
  },
});

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

app.use(router).use(store).use(Rockt).use(ElementPlus).mount("#app");
