export default {
  state: {
    msg: '今天天气很好'
  },
  mutations: {
    // 设置父应用信息
    SET_MSG_VALUE(state, data) {
      state.msg = data;
    }
  },
  actions: {
    // 设置父应用信息
    changeMsg({ commit }, data) {
      commit('SET_MSG_VALUE', data)
    }
  }
}