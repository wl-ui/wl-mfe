const getters = {
  menu: state => state.menu.menu,
  is_collapse: state => state.menu.is_collapse,
  size: state => state.app.size,
  msg: state => state.pagers.msg,
}

export default getters