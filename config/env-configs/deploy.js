/**
/**
 * @name 自动发布至服务器脚本
 * @author weilan
 */

exports.config = {
  // 阿里云服务器
  aliyun: {
    host: '47.2.122.80',                            // 服务器ip
    port: 22,                                          // 服务器端口
    username: 'ee',                                  // 服务器登录名
    password: 'wqwe',                                  // 服务器登录密码
    path: '/usr/local/mfe/web/'                        // 要发布到的服务器路径，你的所有微应用上层目录，脚本会自动在后面拼上一层subapp名作为每个微应用的目录
  },
  // 腾讯服务器
  tencent: {
    host: '33.133.233.132',                            // 服务器ip
    port: 3386,                                        // 服务器端口
    username: 'root',                                  // 服务器登录名
    password: 'test',                                  // 服务器登录密码
    path: "/usr/local/mfe/web/"                        // 要发布到的服务器路径，你的所有微应用上层目录，脚本会自动在后面拼上一层subapp名作为每个微应用的目录
  }
}