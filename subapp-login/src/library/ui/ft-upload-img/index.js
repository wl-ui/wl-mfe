import FtUploadImg from "./index.vue";

FtUploadImg.install = function (Vue) {
  Vue.component(FtUploadImg.name, FtUpload);
};

export default FtUploadImg;