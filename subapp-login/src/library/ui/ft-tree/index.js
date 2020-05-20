import FtTree from "./index.vue";

FtTree.install = function (Vue) {
  Vue.component(FtTree.name, FtTree);
};

export default FtTree;