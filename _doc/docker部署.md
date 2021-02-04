微前端作为解决巨石应用模块化和降低技术框架变动风险的神器，我觉得是当下前端发展的一大方向，可以在未来5-10年内保持生命力。   
作者从2019年12月第一次使用[qiankun](https://github.com/umijs/qiankun)框架落地微服务以来已经过去了一年多的时间，形成了、脚手架、工程结构设计、日常开发维护、性能优化、部署等一整套流程。  
之前有两篇文章讲了qiankun的入门文章：  
[qiankun微前端实战看这篇就够了 - Vue项目篇](https://juejin.cn/post/6844904042427056142):这篇文章编写的较早，大致在19年12月份当时qiankun还在1.x版本，现在关于微应用注册及应用间通信的部分已经和现版本不再合适，因此不再建议刚接触qiankun的同学阅读了  
[vue3.0&qiankun2.0极速尝鲜，微前端进阶实战！](https://juejin.cn/post/6844904143413313549)：这篇是基于qiankun2.0的入门文章，以及如何将1.0平滑升级至2.0版本，另外也探讨了主应用+n子应用的双端口配置方案  
下面讲讲作者在部署上做的一系列方案探索（以下两种方案都更适合一个团队维护N个微应用的场景）：

> 脚本部署  
> docker部署

## 脚本部署
脚本部署是指使用npm run xx的形式一个命令即可将前端静态资源推送至服务器的方式  
#### 大致思路：  
1. 使用node+inquirer编写交互式命令行脚本，像vueCli创建项目一样以伪可视化的形式一步一步指引使用人员进行部署操作。
2. 通过ssh2-sftp-client插件将读node取到的本地文件上传至linux服务器。
4. 将脚本启动命令文件改成.bat文件，可以实现在自己电脑上双击运行。  
#### 功能有：  
1. 使用node读写服务器配置文件，可通过交互式命令行以input框输入的形式创建新的服务器信息  
2. 通过交互式命令行以选择的形式，将前端打包好的文件按你所选要求部署至所选服务器  
#### 效果如下：  
> 添加目标服务器信息  
![添加目标服务器信息](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9f92d827efd46898b41bf3b0e788e81~tplv-k3u1fbpfcp-watermark.image)  
> 一键部署  
![一键部署](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19ebe8517e434b5e8f36ca615ffd2647~tplv-k3u1fbpfcp-watermark.image)  
#### 缺点
1. 需要在目标服务器上配好nginx服务及开机运行（无法带运行环境一起部署）  
2. 暂时无法向windows系统推送部署
3. node读取文件路径虽然可配，但既然要配肯定需要知道微应用打包好的文件位置
4. 需要知道服务器root或者有足够高权限的账号密码

其中node读写、inquirer命令行交互插件、ssh2-sftp-client将文件推送到服务器都是很成熟的插件，另外多个项目一键下载依赖、一键打包、一键部署脚本地址：[多个微应用操作脚本](https://github.com/wl-ui/wl-mfe/tree/master/config/)，此外还可以继续优化，将拉取代码、打包、部署做到一起去，更适合非程序人员。  

## docker 部署
作者刚接触docker几天时间，如有不对之处，欢迎斧；更欢迎指点更多巧妙姿势。  
既然是多个微应用，那直接来docker-compose吧。[官方简介](https://yeasy.gitbook.io/docker_practice/compose/introduction)是这么介绍compose的：`负责实现对 Docker 容器集群的快速编排`。  
按docker文档将docker及docker-compose等相关配置都做好：（win版docker自带docker-compose，开启镜像加速即可；contos需要设置docker用户组、镜像加速、单独安装docker-compose等，都按上面官方简介文档操作即可）
#### 统一优点
1. 自带前端nginx环境，无需再目标服务器配置
#### 统一缺点
1. 每次更新需要上传镜像至阿里云和在目标服务器上拉取阿里云内镜像两步操作

### 使用docker-compose将每个微应用都打包成一个镜像部署
此方案每次微应用内容变更或nginx配置变更之后都需要重新打包镜像，非常繁琐，即便是在docker内npm run build打包并将dist COPY 至镜像空间也依旧如此，如果确实有每个微应用都要打包成一个镜像的话可以用此方式。  
#### 缺点
1. 某一镜像下内容或nginx配置变动，需要重新生成此应用的镜像
> 此方案推荐指数：*
1. 在项目根目录添加`docker-compose.yml`文件。通过docker-compose去调度每个子应用和node服务里面的Dockerfile
```yml
services:
  # 服务端配置
  wl-mfe.server:
    container_name: wl-mfe.server
    restart: always
    build: 
      context: ./_server
      dockerfile: Dockerfile
    ports:
      - '3700:3700'
  # 主应用配置
  master: 			# docker-compose内的容器名
    container_name: master      # 容器名
    restart: always		# 重启策略: 容器退出时总是重启容器
    build: 
      context: ./master		# 服务指定上下文目录
      dockerfile: Dockerfile    # 相对于context的dockerfile文件路径
    environment:
      NODE_ENV: 'production' 
    ports:
      - '2750:2750'  		# 端口映射，宿主机端口：容器端口
  # subapp-login配置
  login:
    container_name: subapp-login
    restart: always
    build: 
      context: ./subapp-login
      dockerfile: Dockerfile
    environment:
      NODE_ENV: 'production'
    ports:
      - '2753:2753'
    depends_on:			# 依赖容器名，会在此容器启动之后启动
      - master
  # ...其他子应用配置方法如上
```
3. 在每个应用目录添加.dockerignore文件，里面写入node_modules
4. 根据docker-compose.yml的设置，在每个子应用文件夹下添加`Dockerfile`和对应的nginx配置文件`yourname.conf`。
> Dockerfile文件，注意里面路径即可
```shell 
# 从官方拉取nginx镜像
FROM nginx  
# 复制dist文件夹到镜像空间，注意docker-compose.yml中指定master的build从./master文件夹开始
COPY dist/ /usr/local/web/master/ 
# 复制master.conf到镜像空间
COPY master.conf /etc/nginx/conf.d/master.conf
```
> master.conf文件，这里nginx配置和普通无二，主应用比子应用多了接口代理，少了允许跨域头信息，其他一致。
```nginx
    server {
        listen       2750;
        server_name  127.0.0.1;

        #charset koi8-r;
        #access_log  logs/host.access.log  main;

        location / {
            root   /usr/local/future/web/master;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;

            # 普通模块接口地址
            location ^~ /Api/ {
                proxy_pass $host:3700/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                #由于服务器端源码(建议大家做好大小写匹配)只匹配了"Upgrade"字符串,所以如果这里填"upgrade"服务器端会将这条http请求当成普通的请求,导致websocket握手失败
                proxy_set_header Connection "Upgrade";
                proxy_set_header Remote_addr $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_read_timeout 600s;
            }

            # 解决 nginx 禁止post请求问题，需要后台配置跨域
            error_page 405 =200 http://$host$request_uri; 
        }

        error_page    502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/local/future/web/master;
        }
    }
```
5. 启动配置好的docker容器集群快速编排
```shell
docker-compose up -d
```
启动成功后可以在终端看到容器信息。
代码地址：[Github](https://github.com/wl-ui/wl-mfe) & [node服务Dockerfile](https://github.com/wl-ui/wl-mfe/blob/master/_server/Dockerfile) & [主应用Dockerfile](https://github.com/wl-ui/wl-mfe/blob/master/master/Dockerfile) & [子应用Dockerfile](https://github.com/wl-ui/wl-mfe/blob/master/subapp-ui/Dockerfile)

### 使用docker-compose打包一个nginx镜像，并将所有微应用通过数据卷的方式挂载进来
此方案除了node服务端外，将所有web端微应用挂载到nginx镜像下，其原理和正常一个nginx启动全部前端静态资源服务一样。这样部署的时候即带nginx环境一起部署，也不需要维护过多的镜像资源，只把所有微应用打包好的dist目录通过volumes挂载至nginx镜像即可。  
#### 优点
1. 因为是挂载的方式，微应用的内容变更或者nginx的配置变更都无需重新制作镜像，只需要重启容器即可生效！
2. 使用nginx官方镜像即可，无需推送至阿里云再拉取部署
#### 缺点
也因为是挂载的方式，需要在宿主机上存在全部应用的dist文件
> 此方案推荐指数：****
1. 在项目根目录添加`docker-compose.yml`文件。
```yml
# by weilan in 2020.01.25 
 version: '3'
 services:
  # 服务端配置
  wl-mfe.server:
    container_name: wl-mfe.server
    restart: always
    build: 
      context: ./_server
      dockerfile: Dockerfile
    ports:
      - '3700:3700'
  wl-mfe.web:
    image: nginx
    restart: always
    container_name: nginx
    environment:
      - TZ=Asia/Shanghai
    ports:
      # nginx端口与宿主机端口映射
      - "8080:80"
      - "80:80"
      - "443:443"
      # 下面是各个微前端的端口映射
      - "2750:2750"
      - "2751:2751"
      - "2752:2752"
      - "2753:2753"
    volumes:
      # 挂载nginx配置
      - ./_docker/nginx/default.conf:/etc/nginx/nginx.conf
      # 挂载各个微前端静态资源
      - ./master/dist/:/usr/local/web/master/
      - ./subapp-blog/dist/:/usr/local/web/subapp-blog/
      - ./subapp-login/dist/:/usr/local/web/subapp-login/
      - ./subapp-ui/dist/:/usr/local/web/subapp-ui/
```

### 使用docker-compose打包nginx镜像+数据卷挂载所有微应用+nginx双端口配置
此方案在上一个方案上稍微对nginx配置做了些调整，可以看到上一个方案主应用+n子应用占用了n+1个端口，这些端口在宿主机上也需要映射开放出来，占用大量端口且可能有些环境不允许这么多端口。这里就用nginx做个转发，形成主应用+子应用双端口的模式
#### 优点
1. 占用端口少
> 此方案推荐指数：*****
#### 大致思路
1. 修改主应用注册子应用的方式，通过端口+命名空间（建议和路由前缀保持一致）的注册方式
```js
 registerMicroApps(
    [
       {
        name: 'subapp-ui', // 子应用app name 推荐与子应用的package的name一致
        entry: 'http://192.168.1.100:2751/ui', // 子应用的入口地址
        container: '#yourContainer', // 挂载子应用内容的dom节点 `# + dom id`【见上面app.vue】
        activeRule: '/ui', // 子应用的路由前缀
      },
    ],
 )
```
2. 删除qiankun推荐的public-path.js打包路径，修改子应用vue.config.js中打包的绝对路径：hostname+命名空间（建议和路由前缀保持一致）
```js
module.exports = {
  publicPath: 'http://192.168.1.100:2751/ui'
  ...
}
```
3. 设置子应用的路由前缀和上面1、2的命名空间保持一致
4. 修改nginx配置做转发
```nginx
    # 子应用
    server {
        listen       2751;
        server_name  localhost;
        add_header   Access-Control-Allow-Origin *;
        add_header   Access-Control-Allow-Methods 'GET,POST';
        add_header   Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization'; 
        # 转发登陆子应用
        location /login {
            alias  /usr/local/mfe/web/subapp-login/;
            index  index.html index.htm;
        }
        # 转发ui子应用
        location /ui {
            alias  /usr/local/mfe/web/subapp-ui/;
            index  index.html index.htm;
        }
        #error_page  404              /404.html;
        error_page    502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/local/mfe/web/master;
        }
    }
```
### 推送至云端（阿里云）
1. 登陆阿里云控制台，找到镜像中心，选择或创建命名空间，然后点击创建镜像仓库，代码源选择本地仓库（初次创建镜像）
2. 在本地终端输入命令登陆阿里云Docker Registry
```shell
docker login --username=阿里云账号 registry.cn-qingdao.aliyuncs.com
```
然后在password后面输入秘密即可，输入密码不会被显示  
3. 给docker镜像打标签
```shell
docker tag [ImageId] registry.cn-qingdao.aliyuncs.com/命名空间/镜像仓库名:版本号
```
ImageId可通过`docker images`查看，版本号自起如0.1；如不加版本号则生成latest
> 注意在其他服务器或电脑上配置docker-compose.yml时如果image不指定版本号则会拉取latest，所以在打标签时直接就不带版本号则会生成latest，如果带版本号则需要再docker tag一次不带版本号的；不然就需要在拉取端的docker-compose.yml下的image中指定版本号。（刚接触如果有误请指正）
4. 将镜像推送至阿里云
```shell
docker push registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe.web:[镜像版本号]
```
> 不带版本号会推送上次docker tag所生成的标签和latest标签至云端

### 在其他服务器或电脑拉取镜像部署
#### 如果你是每个应用一个镜像的多镜像方式
为了方便部署，我们在项目中新增了_docker文件夹，里面是部署需要用到的`docker-compose.yml`和`nginx.conf`文件  
部署docker-compose.yml文件和打包的本地docker-compose.yml文件大体一致：
```yml
services:
  # 增加了nginx自定义配置
  nginx: 
    image: nginx 
    restart: always
    container_name: nginx
    environment:
      - TZ=Asia/Shanghai
    ports:
      - "8080:80"
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
  # 服务端配置
  wl-mfe.server:
    image: registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe-server
    container_name: wl-mfe.server
    restart: always
    ports:
      - '3700:3700'
  # 主应用配置 
  master:
    image: registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe-master # 比本地多了镜像依赖地址，少了build
    container_name: master
    restart: always
    environment:
      NODE_ENV: 'production'
    ports:
      - '2750:2750'
  # subapp-blog配置
  blog:
    image: registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe-subapp-blog
    container_name: subapp-blog
    restart: always
    environment:
      NODE_ENV: 'production'
    ports:
      - '2752:2752'
    depends_on:
      - master
  # subapp-login配置
  login:
    image: registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe-subapp-login
    container_name: subapp-login
    restart: always
    environment:
      NODE_ENV: 'production'
    ports:
      - '2753:2753'
    depends_on:
      - master
  # subapp-ui配置
  ui:
    image: registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe-subapp-login
    container_name: subapp-ui
    restart: always
    environment:
      NODE_ENV: 'production'
    ports:
      - '2751:2751'
    depends_on:
      - master
```
[nginx配置文件地址](https://github.com/wl-ui/wl-mfe/tree/master/_docker/nginx.conf)
#### 如果你是一个nginx镜像，通过数据卷挂载前端微应用的方式
```yml
services:
  # 服务端配置
  wl-mfe.server:
    image: registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe-server
    container_name: wl-mfe.server
    restart: always
    ports:
      - '3700:3700'
  wl-mfe.web:
    image: nginx
    restart: always
    container_name: nginx
    environment:
      - TZ=Asia/Shanghai
    ports:
      # nginx端口与宿主机端口映射
      - "8080:80"
      - "80:80"
      - "443:443"
      # 下面是各个微前端的端口映射
      - "2750:2750"
      - "2751:2751"
      - "2752:2752"
      - "2753:2753"
    volumes:
      # 挂载nginx配置
      - ./_docker/nginx/default.conf:/etc/nginx/nginx.conf
      # 挂载各个微前端静态资源
      - ./master/dist/:/usr/local/web/master/
      - ./subapp-blog/dist/:/usr/local/web/subapp-blog/
      - ./subapp-login/dist/:/usr/local/web/subapp-login/
      - ./subapp-ui/dist/:/usr/local/web/subapp-ui/
```
[nginx配置文件地址](https://github.com/wl-ui/wl-mfe/tree/master/_docker/nginx/default.conf)
#### nginx镜像+volumes挂载微前端资源+双端口配置
```yml
services:
  # 服务端配置
  wl-mfe.server:
    image: registry.cn-qingdao.aliyuncs.com/wlui/wl-mfe-server
    container_name: wl-mfe.server
    restart: always
    ports:
      - '3700:3700'
  wl-mfe.web:
    image: nginx
    restart: always
    container_name: nginx
    environment:
      - TZ=Asia/Shanghai
    ports:
      # nginx端口与宿主机端口映射
      - "8080:80"
      - "80:80"
      - "443:443"
      # 下面是各个微前端的端口映射
      - "2750:2750"
      - "2751:2751"
      - "2752:2752"
      - "2753:2753"
    volumes:
      # 挂载nginx配置
      - ./_docker/nginx/default.conf:/etc/nginx/nginx.conf
      # 挂载各个微前端静态资源
      - ./master/dist/:/usr/local/web/master/
      - ./subapp-blog/dist/:/usr/local/web/subapp-blog/
      - ./subapp-login/dist/:/usr/local/web/subapp-login/
      - ./subapp-ui/dist/:/usr/local/web/subapp-ui/
```
[nginx配置文件地址](https://github.com/wl-ui/wl-mfe/tree/master/_docker/nginx/dual-port.conf)

#### windows 10
1. 确认电脑上已经装好docker并且进BIOS开启过hyper-v；且配置过阿里云镜像加速；启动docker
2. 从你们项目仓库拿到部署时的docker-compose.yml文件，如：[docker部署配置文件地址](https://github.com/wl-ui/wl-mfe/tree/master/_docker)
3. 在docker-compose.yml文件所在目录下运行docker-compose up -d
#### ContOS
1. 确认系统里已经装好docker，docker-compose，且配置好了一系列用户组、镜像加速等操作，且docker已起动
2. 从你们项目仓库拿到部署时的docker-compose.yml文件，如：[docker部署配置文件地址](https://github.com/wl-ui/wl-mfe/tree/master/_docker)，并上传至服务器合适路径下
3. 在服务器中，进入刚才上传所在路径，运行docker-compose up -d

## docker常见问题
### 避免超时错误等意外，设置国内镜像
#### windows 10
1. 打开docker，点击设置；或右键选setting
2. 选择Docker Engine，在registry-mirrors后的数组中加入以下代码
```js
  "https://hub-mirror.c.163.com",
  "https://mirror.baidubce.com"
```
#### CentOS
1. vim /etc/docker/daemon.json 加入以下代码,wq保存退出
```shell
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```
2. 重启生效
sudo systemctl daemon-reload
sudo systemctl restart docker

### docker常用指令

#### 重启docker容器
```shell
docker-compose restart wl-mfe.web
```
#### 启动docker容器集群；或检查docker-compose是否变化并重新创建
```shell
docker-compose up -d
```
#### 重新打包镜像并启动docker-compose中的单个容器，如wl-mfe.web
1. 先停止运行容器login
```shell
  docker-compose stop wl-mfe.web 
```
> 命令后面的名字应该是你docker-compose.yml中的service里的key

2. 删除容器login
```shell
  docker container rm wl-mfe.web
```
> 命令后面的名字应该是你docker-compose.yml中的service下container_name的值

3. 删除镜像login
```shell
  docker rmi 9d8592118538
```
> 命令后面的名字应该是你docker images查看到的id或镜像名；
> 如果报错Error response from daemon: conflict: unable to delete a6dc7e4760c4 (must be forced) - image is referenced in multiple repositories在多个库中被引用，则使用docker rmi +镜像名而要使用id；或者docker rmi -f imageID强制删除

4. 重新打包镜像和容器
```shell
  docker-compose up -d wl-mfe.web
```
> 命令后面的名字应该是你docker-compose.yml中的service里的key

## CICD
目前使用jenkins，社区内教程非常之多，docker的教程也不少，后续研究完补上。

## 如果有微前端项目工程优化需求，作者可以另开一篇文章介绍
