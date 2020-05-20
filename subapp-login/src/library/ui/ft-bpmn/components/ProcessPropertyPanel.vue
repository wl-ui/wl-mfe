<template>
  <div class="property-panel" ref="processPropertyPanel">
    <el-form
      :inline="false"
      label-width="100px"
      size="small"
      label-position="left"
    >
      <el-form-item label="流程名称">
        <el-input :value="name" @input="emitName"></el-input>
      </el-form-item>
      <el-form-item label="流程Key">
        <el-input :value="id" @input="emitId"></el-input>
      </el-form-item>
      <el-form-item label="流程描述">
        <el-input :value="description" @input="emitDescription"></el-input>
      </el-form-item>
    </el-form>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ProcessPropertyPanel",
  props: {
    name: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    emitName(val) {
      this.$emit("update:name", val);
    },
    emitId(val) {
      this.$emit("update:id", val);
    },
    emitDescription(val) {
      this.$emit("update:description", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.property-panel {
  padding: 10px;
  width: 100%;
}
</style>
