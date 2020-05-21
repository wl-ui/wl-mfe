# wl-core

无框架依赖的核心层及工具层封装

### array
提供有关数组的操作方法 Function
```js
export {
  valInDeep, // 从树形数据中递归筛选目标值
  flattenDeep, // 将树形数据向下递归为一维数组
  flattenDeepParents, // 将树形数据向上将此支线递归为一维数组
  regDeepParents, // 根据条件递归祖先元素
  arrayToTree, // 将数组转化成树结构
  patchTreeChain, // 如果数据里缺少树枝节点，则根据parents和自增长id补全整条树链，输出数据调用上部arrToTree函数组装成完整的树
  locationAfterDelete, // 数组删除后重新定位
  splicParentsUntil, // 从坐标值拼接指定字段到祖先元素
  intersectionBy // 根据数组2内的元素，通过match字段匹配数组1内的完整内容组成的数据
};
```

### event
提供对浏览器事件的封装 Function
```js
export {
  throttle, // 节流函数
  debounce // 防抖函数
}
```

### Storage
提供对Storage操作的类，包括local和session两种 Class
```js
export {
  Storage
}
```
均为静态方法，可直接调用。它包括有：
```js
Storage.set('key','value','type[local|session]') // 将键值存入本地存储
Storage.get('key','type[local|session]') // 根据key取本地存储数据
Storage.remove('key','type[local|session]') // 根据key删除本地存储数据
Storage.had('key','type[local|session]') // 根据key查询本地存储中是否存在key的实例
Storage.clear('type[local|session]') // 清空本地存储
Storage.count('type[local|session]') // 获取存储库里存储实例个数
```

### Time
提供对时间操作的类 Class
```js
export {
  Time
}
```
主要用于对时间进行两次及以上操作的情况！对于时间格式化，在wl-vue中提供了time过滤器
使用需要先实例化，全部方法如下：
```js
const timer = new Time('2020-02-14', 'YYYY/MM/DD');

timer.dayjs(date) // 将时间格式转化为dayjs格式（实例化时已经自动调用了此方法）
timer.format(format) // 格式化时间
timer.add(num, unit) // 时间加上数量，要加的时间数量，数量的时间单位
timer.subtract(num, unit) // 时间减去数量，要加的时间数量，数量的时间单位
timer.isBefore(date, unit) // 时间是否在date之前，要比较的时间，时间的单位
timer.diff(date, unit) // 计算时差，要减的日期，时间计算时间的单位
```

### Type
提供判断数据类型的类 Class
```js
export {
  DataType
}
```
均为静态方法，可直接调用。它包括有：
```js
DataType.isObject(data) // 是否对象
DataType.isEmptyObject(data) // 是否空对象
DataType.isArray(data) // 是否数组
DataType.isEmptyArray(data) // 是否空数组
```

### validate
数据验证
```js
export {
  vaPhone, // el手机格式校验
  regPhone, // 正则手机格式校验
  isNum, // 验证数字
  isInteger, // 验证整数
  validate, // 整体表单验证
}
```
### WlNumber
提供精确数字计算的类 Class
```js
export {
  WlNumber
}
```

```js
const beginNum = new WlNumber(1);
// 以下返回big数据，可以使用toString()或to.Fixed()转化
beginNum.plus(2) // 加
beginNum.minus(2) // 减
beginNum.times(2) // 乘
beginNum.div(2) // 除以
beginNum.mod(2) // 取余
beginNum.abs() // 取绝对值
// 以下返回Boolean值
beginNum.gt(2) // 大于
beginNum.gte(2) // 大于等于
beginNum.lt(2) // 小于
beginNum.lte(2) // 小于等于
```
静态方法
```js
WlNumber.toNumber(val) // 返回转化后的bumber型值，不可转化的返回0
```