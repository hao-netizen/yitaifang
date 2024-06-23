const moment = require('moment');
moment.locale('zh-cn');

// 异常处理中间件
let errHandler = (err, req, res, next) => {
  let errStr = `${req.method}-----${req.url}-----${err.message}----${moment().format('LLLL')}${require('os').EOL}`
  require('fs').appendFileSync('./logs/err.log', errStr);

  // 友好响应显示信息
  res.send({
    code: err.code ?? 0,
    message: err.message
  })
}

// 404中间件
let notFoundHandler = (req, res) => {
  res.send({
    code: 404,
    massage: `请求的地址${req.url}不存在`
  })
}


module.exports = {
  errHandler,notFoundHandler
}