## 代做
- 手写双向数据绑定 √
- 手写EventEmitter √
- buffer 常用方法 √
- 手写文件操作方法 读 写 拷贝 √
- 手写创建文件夹方法 √
- 手写删除文件夹方法（广度优先 深度优先） √
- 流的常用方法
- 手写读流 写流 
- tcp
- http
- http-server
- cookie-session
- koa

- 首先进行提取公共js 提成vendorjs引入 ，然后可以对项目中的js，css,图片等进行压缩，另外就是生产环境和开发环境用不同配置，开发环境中可以配置devtool配置 sourcemap  开发环境中就需要把这一项关闭掉，另外还可以利用dllplugin将我们的通用依赖提取出来，另外在文件中还可以配置上hash产数去避免缓存问题