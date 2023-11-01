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

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;

app.use(router).use(store).use(ElementPlus).mount("#app");
