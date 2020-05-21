<template>
  <div class="login-page" :style="{background: bgImage}">
    登录页
    <img :src="bgImage" alt="登陆背景图" />
  </div>
</template>

<script>
import { reactive, ref /* , getCurrentInstance */ } from "@vue/composition-api";
import { getBingHpImageApi } from "@/api/login.js";
import { DataType } from "wl-core";

export default {
  name: "login-page",
  setup() {
    /**
     * @name 处理从bing网站拿到的壁纸作为登陆背景图
     */
    getBingHpImage();
    // 背景图列表
    let bgImageList = reactive([]);
    // 随机取用一张背景图
    let bgImage = ref("");
    getBingHpImage().then(({ data }) => {
      bgImageList = data?.images;
      if (DataType.isArray(bgImageList)) {
        let _random_num = Math.floor(Math.random() * bgImageList.length);
        bgImage = `https://cn.bing.com/${bgImageList[_random_num].url}`;
      }
    });

    // const ctx = getCurrentInstance();

    return {
      bgImage
    };
  }

  /* 
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
  } */
};

const getBingHpImage = () => {
  const _default_bingimg_params = {
    format: "js",
    idx: 0,
    n: 8,
    mkt: "zh-CN"
  };
  return getBingHpImageApi(_default_bingimg_params);
};
</script>

<style lang="scss">
.login-page {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
