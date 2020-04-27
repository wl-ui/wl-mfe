<template>
  <el-menu
    class="the-menu"
    :collapse="is_collapse"
    :text-color="themeMenu.text"
    :default-openeds="menuDefaultOpeneds"
    :background-color="themeMenu.background"
    :active-text-color="themeMenu.active_text"
  >
    <div class="the-menu-logo">{{is_collapse?'WL2.0':'WL微前端项目2.0'}}</div>
    <el-submenu v-for="sub of menu" :key="sub.id" :index="sub.id">
      <template slot="title">
        <i class="menu-icon" :class="sub.icon"></i>
        <span class="menu-sub-title">{{sub.title}}</span>
      </template>
      <el-menu-item
        v-for="item of sub.children"
        :key="item.id"
        :index="item.id"
        @click="goto(sub.module, item.url)"
      >
        <span class="menu-item-title">{{item.title}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex"; // 引入状态共享
import { routerGo } from "@/utils/utils.js"; // 引入跨应用路由跳转

export default {
  name: "theMenu",
  data() {
    return {
      theme_menu: {
        background: "#2A3F54",
        text: "#fff",
        active_text: "#ffd04b"
      } // 菜单主
    };
  },
  computed: {
    // 左侧菜单主题
    themeMenu() {
      return this.theme_menu;
    },
    // 左侧菜单默认展开
    menuDefaultOpeneds() {
      return this.menu.map(i => i.id);
    },
    // 导入vuex菜单数据，菜单折叠状态
    ...mapGetters(["menu", "is_collapse"])
  },
  methods: {
    // 跨应用路由跳转
    goto(title, href) {
      routerGo(href, title);
    }
  }
};
</script>

<style lang="scss">
.the-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.the-menu {
  height: 100%;
  border-color: #2a3f54;
  .the-menu-logo {
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }
  .menu-icon {
    color: #fff;
  }
  .menu-sub-title {
    margin-left: 6px;
    font-weight: 600;
  }
}
</style>
