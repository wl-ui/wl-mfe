/**
 * @name 自动发布至服务器脚本
 * @author weilan
 */

exports.config = {
  // 测试服
  test: {
    host: '192.168.1.140',           // 服务器ip
    port: 22,                        // 服务器端口
    username: 'root',                // 服务器登录名
    password: 'root',                // 服务器登录密码
    path: '/usr/local/web/'          // 要发布到的服务器路径，你的所有微应用上层目录，脚本会自动在后面拼上一层subapp名作为每个微应用的目录
  },
    //-----***----- 
}