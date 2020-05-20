import FtUpload from "./index.vue";

FtUpload.install = function (Vue) {
  Vue.component(FtUpload.name, FtUpload);
};

export default FtUpload;