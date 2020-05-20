<template>
  <el-button
    :size="size"
    :type="type"
    :icon="icon"
    :plain="plain"
    :round="round"
    :circle="circle"
    :loading="loading"
    :disabled="disabled"
    :autofocus="autofocus"
    :native-type="nativeType"
    >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: "ft-button",
  props: {
    size: {
      type: String,
      default: "medium"
    },
    type: String,
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    autofocus: {
      type: Boolean,
      default: false
    },
    nativeType: {
      type: String,
      default: "button"
    }
  }
};
</script>

