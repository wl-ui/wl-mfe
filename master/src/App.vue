<template>
  <div id="root" class="main-container">
    <!-- 左侧菜单区 -->
    <the-menu class="main-menu-box" />
    <!-- 右侧视图 -->
    <div class="main-container-content">
      <!-- 上部导航区 -->
      <the-nav />
      <!-- 子应用渲染区 -->
      <div class="main-container-view">
        <el-scrollbar class="wl-scroll">
          <!-- qiankun2.0  container 模式-->
          <div id="subapp-viewport" class="app-view-box"></div>
          <!-- qiankun1.0  render 模式-->
          <div v-html="appContent" class="app-view-box"></div>
          <div v-if="loading" class="subapp-loading"></div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import TheMenu from "@/components/TheMenu.vue";
import TheNav from "@/components/TheNav.vue";

export default {
  name: "rootView",
  components: {
    TheMenu,
    TheNav
  },
  props: {
    loading: Boolean,
    appContent: String
  }
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.main-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.main-container-content {
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  > .main-container-view {
    padding: 8px;
    width: 100%;
    height: calc(100% - 60px);
    background: $main-base-color;
    box-sizing: border-box;
    > .wl-scroll {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 4px;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }

    .app-view-box {
      width: 100%;
      padding: 12px;
      box-sizing: border-box;
    }
  }
}
.subapp-loading {
  background: url("~@/assets/images/loading.gif");
}
</style>
