import QueryForm from "./QueryForm.vue";

// vue插件需要定义install方法 === 传入vue实例app
QueryForm.install = (app) => {
  // 挂载组件
  app.component(QueryForm.name, QueryForm);
};

export default QueryForm;
