// 总路由
const router = require('express').Router();

// 添加路由信息

// 通过文件夹读取 文件信息====> 添加路由
require('fs').readdirSync('./routers').filter(v => v != 'index.js').forEach(v => {
  let firstRoute = v.split('.').slice(0, -1).join('.');
  router.use(`/${firstRoute}`, require(`./${v}`));
})


// 导出路由

module.exports = router;

