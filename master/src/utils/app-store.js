/**
 * @name 启动qiankun应用间通信机制
 * @param {Function} initGlobalState 官方通信函数
 * @description 注意：主应用是从qiankun中导出的initGlobalState方法，
 * @description 注意：子应用是附加在props上的onGlobalStateChange, setGlobalState方法（只用主应用注册了通信才会有）
 */
const appStore = (initGlobalState) => {
  const { onGlobalStateChange, setGlobalState } = initGlobalState({
    msg: '来自master初始化的消息',
  });

  onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev));

  setGlobalState({
    ignore: 'master',
    msg: '来自master动态设定的消息',
  });
}

export default appStore;