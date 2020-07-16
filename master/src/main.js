/**
 * @name 统一注册外部插件、样式、服务等
 */
import './core/install'

/**
 * @name 微前端基座主应用vue实例化
 * @deprecated 本示例只针对 qiankun2.0 因此只留下注释后的代码在此提醒各位读者如何兼容qiankun1.0
 * @description 2.0版本正常实例化vue即可，不需要此render函数
 * @description 兼容 qiankun1.0 的render 在core/renderForQiankun1.0.js
 * @description qiankun registerMicroApps方法 render用到，如果使用container装载子应用，无需此render函数
 */
import './core/render'

/**
 * @name 验证登陆身份并启动微应用
 */
import microAppStart from './core/auth'
microAppStart()
