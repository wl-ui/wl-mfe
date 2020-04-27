export default {
  namespaced: true,
  state: {
    is_collapse: false, // 折叠状态
    menu: [], // 菜单数据
  },
  mutations: {
    // 推入用户菜单
    SET_MENU(state, data) {
      state.menu = data;
    },
    // 设置折叠状态
    SET_COLLAPSE_STATUS(state, data) {
      state.is_collapse = data;
    }
  },
  actions: {
    // 推入用户菜单
    setMenu({ commit }, data) {
      commit('SET_MENU', data)
    },
    // 设置折叠状态
    setCollapseStatus({ commit }, data) {
      commit('SET_COLLAPSE_STATUS', data)
    },
  }
}