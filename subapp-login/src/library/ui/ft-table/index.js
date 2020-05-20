import FtTable from "./index.vue";

FtTable.install = function (Vue) {
  Vue.component(FtTable.name, FtTable);
};

export default FtTable;