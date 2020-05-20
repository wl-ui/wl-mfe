
export default {
  name: 'auth',
  rule: (store) => ({
    // 指令已经添加到元素上，el-指令相关dom元素；binding-对象
    inserted(el, binding) {
      // 将权限码字段从binding中提取
      const { value: _data } = binding;
      // 将所有按钮权限码提取
      const _permissions = store?.getters?.permissions || [];

      if (!_data) throw new Error(`The auth code is required，eg: v-auth="add" || v-auth="['add', 'edit']"`)
      // 当前权限是一个权限码集合时 or 是一个权限码字符串时
      let _hasPermissions = Array.isArray(_data) ? _data.some(i => _permissions.includes(i)) : _permissions.includes(_data);
      if (!_hasPermissions) {
        el?.parentNode?.removeChild?.(el)
      }
    }
  })
}
