<template>
  <div style="width:100%">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          基本设置<i class="header-icon el-icon-info"></i>
        </template>
        <custom-general v-if="modeler" :modeler="modeler"></custom-general>
      </el-collapse-item>
      <el-collapse-item title="监听器">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
  
</template>

<script>
import CustomGeneral from "./parts/General";

export default {
  name: 'CustomPropertiesPanel',
  props: {
    modeler: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

    }
  },
  components: {
    CustomGeneral
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style>

</style>