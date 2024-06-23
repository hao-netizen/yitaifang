// 用户路由模块
const router = require('express').Router();
// 导出中间件
const { detailMid,listMid } = require('../middleware/goods');
// 导入控制器
const { cateCon, detailCon,listCon } = require('../controllers/goods');
// 添加路由信息
router.get('/category', cateCon);
router.get('/item/:id?', detailMid, detailCon);
router.get('/list', listMid, listCon);



// 导出路由
module.exports = router;