# library 跨项目、团队公共资源库

这是一个为多个项目及团队提供公共资源支持的仓库。    

> 注意
1. 放入此处的文件是否满足提供多项目使用的条件

2. 此项目的文件改动必须向上兼容，不允许再未经讨论的情况下进行大的重构

3. 提交项目代码时正常提交即可，但是需要手动将此目录推送至公共资源仓库

4. 不收录任何与业务相关的逻辑组件，如附带有业务逻辑代码组件放至components文件夹作为项目内公共组件；   
  如有特殊基础类情况，则不可写死业务数据，以尽可能的传入参数、slot、函数回调来完成相关逻辑

> 提交公共资源子仓库时，在项目根路径执行以下命令

1. 完整命令版
```
  git subtree add --prefix=src/library http://39.100.247.185/Bonobo.Git.Server/SmartBuilding.FE.Library.git master --squash

  git subtree pull --prefix=src/library http://39.100.247.185/Bonobo.Git.Server/SmartBuilding.FE.Library.git master --squash

  git subtree push --prefix=src/library http://39.100.247.185/Bonobo.Git.Server/SmartBuilding.FE.Library.git master
```

2. 简化命令版

> 先将子仓库地址添加为remote：
```
  git remote add -f library http://39.100.247.185/Bonobo.Git.Server/SmartBuilding.FE.Library.git
```

> 此后再提交即可使用以下精简命令
```
  git subtree add --prefix=src/library library master --squash

  git subtree pull --prefix=src/library library master --squash
  
  git subtree push --prefix=src/library library master
```