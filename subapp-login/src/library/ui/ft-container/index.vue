<template>
  <div class="ft-container">
    <!-- 主体内容区 - 头部 -->
    <div class="ft-container-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <!-- 主体区 -->
    <el-scrollbar class="ft-container-scroll" v-if="useScroll">
      <slot></slot>
    </el-scrollbar>
    <div v-else class="ft-container-main" :class="ftBodyClass">
      <slot></slot>
    </div>
    <!-- 主体内容区 - 底部 -->
    <div class="ft-container-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ft-container",
  props: {
    // 是否使用带scroll的main
    useScroll: {
      type: Boolean,
      default: true
    },
    // 自定义main的class
    ftBodyClass: [String, Function],
    // 更多条件
  }
};
</script>

<style lang="scss">
.ft-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 8px;

  > .ft-container-scroll {
    flex: 1;
    flex-grow: 1;
    flex-shrink: 1;
    > .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  > .ft-container-main {
    position: relative;
    flex: 1;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: hidden;
  }
}
</style>