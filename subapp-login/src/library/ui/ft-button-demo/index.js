import WlButton from "./index.vue";

WlButton.install = function (Vue) {
  Vue.component(WlButton.name, WlButton);
};

export default WlButton;