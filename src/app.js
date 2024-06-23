// 需要使用的第三方模块
// express / cors / moment/ bcryptjs /jsonwebtoken/multer
// 在db中将用户登录成功后的token和id存储在 token.json文件(用户登录状态的白名单)
//   --- 每次用户注销登录(退出)的时候则 将存储的id和token移除(并且默认在每次服务器启动时候都将该文件清空)
//   --- 每次校验token的时候,判断token在token.json文件中是否存在,如果不存在(表示该用户退出登录了)

const express = require('express');
const app = express();// 创建app服务
app.listen(9000, () => console.log(`
  服务器启动成功!
  地址: http://127.0.0.1:9000
`))

const { writeAll } = require('./model/token');
const { keep } = require('./conf/index');
keep || writeAll([]);


// 跨域资源共享
app.use(require('cors')());

// 静态资源托管--->托管上传的图片资源
app.use(express.static('./public/upload'));
app.use(express.static('./public/carousel'));

// 处理请求体中的数据====>post请求携带的数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 处理路由
app.use(require('./routers/index.js'));

// 导出中间件处理函数
const { errHandler: eH, notFoundHandler: nFH } = require('./middleware/errAndNotFound')
// 错误处理及404处理
app.use(eH);
app.use(nFH);



/* 
  后台权限管理
    - RBAC
      + 基于角色的权限管理
    - 此后台管理系统权限分两级
      + 管理员(admin)/游客(youke) ===> db/user.json====>每个用户的role字段区分
        - 管理员可以登录后台管理
        - 游客只能在前台购物浏览
*/