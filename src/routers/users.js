// 用户路由
const router = require('express').Router();

// 导入中间件
const { registerMid, loginMid, infoMid, checkToken: ctk, rpwdMid, updMid,backCheckToken:bctk } = require('../middleware/user');
const { registerCon, loginCon, infoCon, outCon, rpwdCon, updCon, backLoginCon,listCon,searchCon,resetCon,flagCon,delCon,codeCon } = require('../controllers/users');

// 添加路由信息
router.post('/register', registerMid, registerCon);
router.post('/login', loginMid, loginCon);
router.get('/info', infoMid, ctk, infoCon);
router.get('/logout', infoMid, ctk, outCon);
router.post('/rpwd', rpwdMid, ctk, rpwdCon);
router.post('/update', updMid, ctk, updCon);


// 后台管理的路由
// 验证码
router.get('/backend/code', codeCon);
// 后台登录
router.post('/backend/login', loginMid, backLoginCon);
// 获取单个用户信息
router.get('/backend/info', infoMid, bctk, infoCon);
// 退出注销
router.get('/backend/logout', infoMid, bctk, outCon);
// 后台获取用户列表
router.get('/backend/list', bctk, listCon);
// 后台搜索用户列表
router.get('/backend/search', bctk, searchCon);
// 后台用户管理重置密码
router.post('/backend/reset', bctk, resetCon);
// 后台用户管理 禁用
router.post('/backend/flag', bctk, flagCon);
// 后台用户管理 删除
router.post('/backend/del', bctk, delCon);


// 导出路由
module.exports = router;

/*
  登录请求接口
    - 接口地址: http://127.0.0.1:9000/users/backend/login
    - 请求方式: post
    - 携带数据: username,password
  后台获取用户信息
    - 接口地址: http://127.0.0.1:9000/users/backend/info
    - 请求方式: get
    - 携带数据: id,token
  后台获取用户列表
    - 接口地址: http://127.0.0.1:9000/users/backend/list
    - 请求方式: get
    - 携带数据: id,token
  后台搜索用户列表
    - 接口地址: http://127.0.0.1:9000/users/backend/search
    - 请求方式: get
    - 携带数据: id,token,searchStr(非)
  后台重置用户密码
    - 接口地址: http://127.0.0.1:9000/users/backend/reset
    - 请求方式: post
    - 携带数据: id,token,uid(操作用户的id)
    - 备注: 默认将密码重置为 123456
  后台禁用/解禁
    - 接口地址: http://127.0.0.1:9000/users/backend/flag
    - 请求方式: post
    - 携带数据: id,token,uid(操作用户的id)
  后台删除用户
    - 接口地址: http://127.0.0.1:9000/users/backend/del
    - 请求方式: post
    - 携带数据: id,token,uid(操作用户的id)    
*/