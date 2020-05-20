const getters = {
  menu: state => state.menu.menu,
  is_collapse: state => state.menu.is_collapse,
  size: state => state.app.size,
  token: state => state.app.token,
  msg: state => state.appstore.msg,
}

export default getters