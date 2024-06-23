// 轮播图路由模块
const router = require('express').Router();
// 导出中间件
const { backCheckToken: bctk } = require('../middleware/user');
const { uploadOne,uploadMany } = require('../utils/uploadLbt')

const { addCon, listCon,removeCon,addManyCon } = require('../controllers/carousel');

// 获取轮播图列表(前台后台都可以使用)
router.get('/list', listCon);

// 后台使用的轮播图管理接口
// 上传单个轮播图接口
router.post('/backend/add', uploadOne, bctk, addCon);
// 上传多个轮播图接口
router.post('/backend/addMany', uploadMany, bctk, addManyCon);
// 删除轮播图接口
router.post('/backend/remove', bctk, removeCon);


// 导出路由
module.exports = router;

/*
  db/carousel.json中的记录了所有显示的轮播图的文件名
    - [{id,name:文件名称},....]

  轮播图接口
    - 获取轮播图列表接口(前后台都可使用)
      + 接口地址: http://127.0.0.1:9000/carousel/list
      + 请求方式: get
      + 携带参数: 
    - 接受上传轮播图接口
      + 接口地址: http://127.0.0.1:9000/carousel/backend/add
      + 请求方式: post
      + 携带参数: id,token,carousel(上传的文件)
    - 接受上传轮播图接口
      + 接口地址: http://127.0.0.1:9000/carousel/backend/addMany
      + 请求方式: post
      + 携带参数: id,token,carousel(上传的文件)
    - 删除轮播图接口
      + 接口地址: http://127.0.0.1:9000/carousel/backend/remove
      + 请求方式: post
      + 携带参数: id,token,imgId
*/