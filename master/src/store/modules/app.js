export default {
  namespaced: true,
  state: {
    size: 10,  // 分页 页大小
    token: ''
  },
  mutations: {
    // 设置分页大小
    SET_PAGE_SIZE(state, data) {
      state.size = data;
    },
    // 设置token
    SET_TOKEN(state, data) {
      state.token = data;
    },
  },
  actions: {
    // 设置分页大小
    setPageSize({ commit }, data) {
      commit('SET_PAGE_SIZE', data)
    },
    // 设置token
    setToken({ commit }, data) {
      commit('SET_TOKEN', data)
    }
  }
}