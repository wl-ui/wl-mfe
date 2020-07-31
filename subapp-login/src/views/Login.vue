<template>
  <div class="login-page">
    <!-- 背景图 -->
    <img class="login-page-bg" :src="bgImage" alt="登陆背景图" />
    <!-- 登陆表单 -->
    <div class="login-form-box">
      <el-form :model="loginForm" :rules="loginRules" ref="login-form">
        <el-form-item label="账号" prop="account">
          <el-input v-model="loginForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入账号"></el-input>
        </el-form-item>
      </el-form>
      <div class="align-right login-button">
        <el-button type="primary" class="width-full" @click="handleLogin('login-form')">立即登录</el-button>
      </div>
      <div class="login-link-box">
        <div>立即注册</div>
        <div>忘记密码</div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, getCurrentInstance } from "@vue/composition-api"; // 导入vue3api
import { DataType, Storage } from "wl-core"; // 导入核心工具库
import { getBingHpImageApi, loginApi } from "@/api/login.js"; // 导入接口

export default {
  name: "login-page",
  setup() {
    /**
     * @name 拿到当前上上文
     */
    const ctx = getCurrentInstance();
    /**
     * @name 处理从bing网站拿到的壁纸作为登陆背景图
     */
    getBingHpImage();
    // 背景图列表变量
    let bgImageList = reactive([]);
    // 随机取用一张背景图
    let bgImage = ref("");
    getBingHpImage().then(({ data }) => {
      bgImageList = data?.images;
      if (DataType.isArray(bgImageList)) {
        let _random_num = Math.floor(Math.random() * bgImageList.length);
        bgImage.value = `https://cn.bing.com/${bgImageList[_random_num].url}`;
      }
    });

    /**
     * @name 处理登陆表单逻辑
     */
    // 表单字段
    let loginForm = reactive({
      account: ref(""), // 账号
      password: ref(""), // 密码
    });
    // 表单验证逻辑
    let loginRules = reactive({
      account: [{ required: true, message: "请输入账号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    });
    // 登录逻辑
    const handleLogin = async (name) => {
      // 登录表单验证
      const _va_login = await loginValidate(name, ctx);
      // 验证通过调用登陆接口
      if (!_va_login) return;
      // 整理接口参数
      const _data = {
        account: loginForm.account,
        password: loginForm.password,
      };
      // 请求接口
      const { status, res } = await loginSubmit(_data);
      // 处理登录后逻辑
      if (!status) {
        ctx.$wlMessage({
          type: "error",
          message: "登录失败",
        });
        return;
      }
      // 处理登录成功后逻辑
      loginedTodo(res.headers.authorization);
      ctx.$wlMessage({
        type: "success",
        message: res.data.message,
      });
    };
    return {
      // 变量开始
      bgImage,
      loginForm,
      loginRules,
      // 方法开始
      handleLogin,
    };
  },
};

/**
 * @name 获取bing壁纸
 */
const getBingHpImage = () => {
  const _default_bingimg_params = {
    format: "js",
    idx: 0,
    n: 8,
    mkt: "zh-CN",
  };
  return getBingHpImageApi(_default_bingimg_params);
};
/**
 * @name 登陆表单校验
 * @param {String} formName 表单ref名
 * @param {Object} ctx 上下文
 */
const loginValidate = (formName, ctx) => {
  return new Promise((resolve) => {
    ctx.$refs[formName].validate((valid) => {
      resolve(valid);
    });
  });
};
/**
 * @name 登录接口提交
 */
const loginSubmit = (data) => {
  return new Promise((resolve, reject) => {
    loginApi(data)
      .then((res) => {
        let _success = res.data.code === 200;
        let _res = { status: _success, res };
        _success ? resolve(_res) : reject(_res);
      })
      .catch((err) => reject({ status: false, res: err }));
  });
};
/**
 * @name 登录成功后逻辑
 * @param {String} token token
 */
const loginedTodo = (token) => {
  // 将token存入本地
  Storage.set("token", token);
  window?.location?.reload?.();
};
</script>

<style lang="scss">
.login-page {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  > .login-form-box {
    position: fixed;
    top: 40%;
    left: 50%;
    margin-top: -160px;
    margin-left: -230px;
    width: 460px;
    height: 320px;
    padding: 15px;
    background: rgba(245, 245, 245, 0.6);
    box-shadow: inset 0px 0px 11px 0px #fff;

    .login-button {
      padding-top: 20px;
    }

    .login-link-box {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      cursor: pointer;
    }
  }
}
</style>
