// 用户路由模块
const router = require('express').Router();
// 导出中间件
const {thirdMid,fourthMid} = require('../middleware/test');
// 导入控制器===>路由最后的处理函数
const { firstCon,secondCon,thirdCon,fourthCon } = require('../controllers/test')

// 添加路由信息
router.get('/first', firstCon);
router.get('/second', secondCon);
router.get('/third', thirdMid,thirdCon);
router.post('/fourth', fourthMid,fourthCon);


// 导出路由
module.exports = router;