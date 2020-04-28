<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/logo.png" />
    <div class="msg-box">
      <div class="msg-title">这里是子应用：</div>
      <div class="msg-context">{{selfMsg}}</div>
    </div>
    <div class="msg-box">
      <div class="msg-title">来自其他微应用的消息：</div>
      <div class="msg-context">{{vuexMsg}}</div>
    </div>
    <div class="msg-box">
      <div class="msg-ipt-box">
        <input class="msg-ipt" type="text" v-model="formMsg" placeholder="请输入你想广播的话" />
      </div>
      <div class="msg-btn-box">
        <button class="msg-btn" @click="handleVuexMsgChange">发送广播</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from "vue";
import { setState } from "@/utils/app-store";

export default {
  name: "Home",
  setup() {
    /**
     * @name 通过getCurrentInstance方法得到当前上下文
     */
    const { ctx } = getCurrentInstance();
    /**
     * @name 定义一个初始数据
     */
    const selfMsg = ref("subapp-blog");
    /**
     * @name 定义一个计算属性，返回vuex中的数据
     */
    const vuexMsg = computed(() => ctx.$store.getters.msg);
    /**
     * @name 定义一个表单元素v-model绑定的变量
     */
    const formMsg = ref("");

    /**
     * @name 定义一个广播事件
     */
    const handleVuexMsgChange = () => {
      /**
       * @name 注意：在setup内部使用定义的变量，需要用**.value取值！
       */
      setState({
        msg: formMsg.value
      });
    };

    return {
      selfMsg,
      vuexMsg,
      formMsg,
      handleVuexMsgChange
    };
  }
};
</script>

<style lang="scss">
.msg-box {
  display: flex;
  margin: 20px auto;
  width: 800px;
  height: 30px;
  text-align: left;

  > .msg-title {
    width: 180px;
    font-weight: 600;
  }
  > .msg-context {
    flex: 1;
    font-weight: 600;
    color: #f56c6c;
  }

  > .msg-ipt-box,
  .msg-btn-box {
    flex: 0.5;
  }

  .msg-ipt {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 36px;
    line-height: 36px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
  .msg-btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0 0 0 15px;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 7px 20px;
    font-size: 14px;
    border-radius: 4px;
    height: 36px;
    line-height: 22px;
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
}
</style>
