<template>
  <div class="wl-contentmenu-list" @click="rowClick">
    <div
      v-for="item in menulist"
      :key="item.value"
      :data-value="item.value"
      class="wl-contentmenu-item"
      flex="cross:center main:center"
    >
      <i v-if="item.icon" :name="item.icon"></i>
      <div class="wl-contentmenu-item-title" flex-box="1">{{item.title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "wl-contextmenu-list",
  props: {
    menulist: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    rowClick(event) {
      let target = event.target;
      while (!target.dataset.value) {
        target = target.parentNode;
      }
      this.$emit("rowClick", target.dataset.value);
    }
  }
};
</script>

<style lang="scss">
.wl-contentmenu-list {
  .wl-contentmenu-item {
    padding: 8px 20px 8px 15px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    &:hover {
      background: #ecf5ff;
      color: #66b1ff;
    }
    .wl-contentmenu-item-title {
      margin-left: 10px;
    }
  }
}
</style>
