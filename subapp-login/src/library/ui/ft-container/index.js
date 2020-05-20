import FtContainer from "./index.vue";

FtContainer.install = function (Vue) {
  Vue.component(FtContainer.name, FtContainer);
};

export default FtContainer;