// 导入正则
const { userReg, ageReg } = require('../conf/index')

// 测试路由的 中间件
let thirdMid = (req, res, next) => {
  let { name, age } = req.query;

  if (!name) return next({ code: 0, message: '参数name没有传递' });
  if (!age) return next({ code: 0, message: '参数age没有传递' });

  if (!userReg.test(name)) return next({ code: 5, message: '参数name格式错误' });
  if (!ageReg.test(age)) return next({ code: 5, message: '参数age格式错误' });

  next();
}

let fourthMid = (req, res, next) => {
  let { name, age } = req.body;

  if (!name) return next({ code: 0, message: '参数name没有传递' });
  if (!age) return next({ code: 0, message: '参数age没有传递' });

  if (!userReg.test(name)) return next({ code: 5, message: '参数name格式错误' });
  if (!ageReg.test(age)) return next({ code: 5, message: '参数age格式错误' });

  next();
}


// 导出
module.exports = {
  thirdMid, fourthMid
}