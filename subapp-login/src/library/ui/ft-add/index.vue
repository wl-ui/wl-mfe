
<template>
  <el-button :type="type" :icon="icon" @click="submitAdd()" v-loading="loading">
    <slot>确 定</slot>
  </el-button>
</template>

<script>
/**
 * fndbs1314 update 2020/3/16
 * 增加icon属性
 */
import { throttle } from "lodash";

export default {
  name: "ft-add",
  props: {
    // loading管理
    loading: {
      type: Boolean,
      default: false
    },
    // 类型
    type: {
      type: String,
      default: "primary"
    },
    icon: {
      type: String,
      default: ""
    }
  },
  methods: {
    submitAdd: throttle(function() {
      this.$emit("click");
    }, 2000)
  }
};
</script>

<style lang="scss">
.ft-scroll {
  flex: 1;
  > .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>