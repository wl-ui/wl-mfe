<template>
  <el-input
    v-model="selfValue"
    class="width-full"
    :class="{'is-error': !verified}"
    :placeholder="placeholder"
    @change="handleChange"
  ></el-input>
</template>

<script>
/**
 * auth: weilan
 * time: 2020.04.08
 * des: 带校验的输入框组件
 * @param value 值
 * @param type 期望输入的值类型
 * @param required 是否必填
 * @param validator 自定义校验
 * @param numInteger 当类型是number时是否要求整数
 * @param numPositive 当类型是number时是否要求正数
 * @param placeholder placeholder
 * @emits change 选择改变
 */
import { isNum } from "@/library/js/validate"; // 导入自带校验规则

export default {
  name: "ft-input",
  props: {
    value: [String, Number],
    number: {
      type: Boolean,
      default: false
    }, // 是否需要数字类型
    required: {
      type: Boolean,
      default: false
    }, // 是否必填
    validator: Function, // 自定义校验
    numInteger: {
      type: Boolean,
      default: false
    }, // 当类型是number时是否要求整数
    numPositive: {
      type: Boolean,
      default: false
    }, // 当类型是number时是否要求正数
    placeholder: {
      type: String,
      default: "请输入"
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      verified: true,
      selfValue: ""
    };
  },
  created() {
    this.selfValue = this.value;
  },
  watch: {
    value(val) {
      this.selfValue = val;
    }
  },
  methods: {
    // 改变值
    handleChange(val) {
      this.selfValue = val;
      let empty = this.number
        ? [0, "0", NaN, "", null, undefined]
        : ["", NaN, null, undefined];
      if (this.required && empty.includes(val)) {
        this.verified = false;
        this.$emit("change", val, false);
        return;
      }
      if (this.validator) {
        this.verified = this.validator(val);
        this.$emit("change", val, this.verified);
        return;
      }
      if (this.number) {
        this.verified = isNum(val, this.numInteger, this.numPositive);
        this.$emit("change", val, this.verified);
        return;
      }
      this.verified = true;
      this.$emit("change", val, this.verified);
    },
    // 验证函数
    validate() {
      let empty = this.number
        ? [0, "0", NaN, "", null, undefined]
        : ["", NaN, null, undefined];
      if (this.required && empty.includes(this.selfValue)) {
        this.verified = false;
        return this.verified;
      }
      if (this.validator) {
        this.verified = this.validator(this.selfValue);
        return this.verified;
      }
      if (this.number) {
        this.verified = isNum(
          this.selfValue,
          this.numInteger,
          this.numPositive
        );
        return this.verified;
      }
      return true;
    }
  }
};
</script>

<style lang="scss">
.is-error {
  .el-textarea__inner,
  .el-input__inner {
    border-color: #f56c6c;
  }
}
</style>