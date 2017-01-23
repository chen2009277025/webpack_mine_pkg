## 前后端分离方案基础构建

### 文件结构说明
* app/page/XXX/XXX 如(app/page/shop/newShop) 下面有index.js 主流程控制
* app/module/  业务相关的模块(以功能划分文件夹)
* app/component/  抽象程度高的组件
* mock/ mock数据文件存放

###本地运行步骤
* `git clone`
* `npm install`
* `npm start`
* 安装chrome插件 [下载](http://wiki.sankuai.com/pages/viewpage.action?pageId=424892736)

### 新建功能页面步骤
* 在app/page目录下新建文件夹,已经对应主js
* 增加app.json中的文件映射
* npm dev 同时启动项目和mock服务,即时修改刷新浏览器

### 数据mock
使用url匹配  
'*/api/*' : 转发到线下  
'*/mock/*' :转发到本地mock服务  
使用美团[vane数据模拟工具](http://vane.sankuai.com/)  
[mock文件编写规范](http://vane.sankuai.com/doc.html)  
注意:文件命名需要为*.adoc.md 其中的接口会自动加入接口列表  
mock服务启动后,修改mock文件,会自动刷新接口列表  

本地需要安装vane的客户端  
`npm install -g vane`  
在项目根目录执行  
`npm run mock`
即可开启mock服务  

`npm run dev` 同时启动项目和mock服务,即时修改刷新浏览器  

### 静态文件同步到后端服务器
* 需要在部署机器执行pre-deploy脚本后配置异步拷贝命令，copy静态文件到后端server
* 后端工程需要配置html页面相应的工程访问路径

### eslint
* 可在.eslintrc.json配置检查规则
* npm start会同步开启lint检查，如发生error会启动失败
* npm run lint 会检查所有app/目录下的文件
* 可以单独检查某个文件，eg: eslint app/page/page1/page1/main.js

### 关于侧边栏
侧边栏采用先富统一的侧边栏  
在开发中 使用127.0.0.1访问本机时,会自动使用线下的UPM菜单  
如果使用localhost访问本机,则会使用线上UPM的菜单  
