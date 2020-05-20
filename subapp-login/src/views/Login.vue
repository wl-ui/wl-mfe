<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    登录页
  </div>
</template>

<script>
import { getBingHpImageApi } from "@/api/login.js";

export default {
  name: "login-page",
  components: {},
  data() {
    return {
      bgImageList: [] // 背景图
    };
  },
  created() {
    this.getBingHpImage();
  },
  methods: {
    // 获取背景图壁纸
    getBingHpImage() {
      const _default_bingimg_params = {
        format: "js",
        idx: 0,
        n: 8,
        mkt: "zh-CN"
      };
      getBingHpImageApi(_default_bingimg_params).then(({ data }) => {
        this.bgImageList = data?.images || [];
      });
    }
  }
};
</script>
