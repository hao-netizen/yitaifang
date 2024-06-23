// 用户相关的中间件
// 导入正则
const { userReg, pwdReg, nickReg, ageReg, genderReg } = require('../conf/index');
const { verifyToken, backverifyToken } = require('../utils/token')
const { findTokenAll } = require('../model/token')
// 注册中间
let registerMid = (req, res, next) => {
  let { username, password, rpassword, nickname } = req.body;

  if (password != rpassword) return next({ code: 0, message: '两次密码不一致' });

  if (!username) return next({ code: 0, message: '参数username必须传递' });
  if (!password) return next({ code: 0, message: '参数password必须传递' });
  if (!rpassword) return next({ code: 0, message: '参数rpassword必须传递' });
  if (!nickname) return next({ code: 0, message: '参数nickname必须传递' });

  if (!userReg.test(username)) return next({ code: 5, message: '参数username格式错误' });
  if (!pwdReg.test(password)) return next({ code: 5, message: '参数password格式错误' });
  if (!nickReg.test(nickname)) return next({ code: 5, message: '参数nickname格式错误' });

  next();
}

let loginMid = (req, res, next) => {
  let { username, password } = req.body;

  if (!username) return next({ code: 0, message: '参数username必须传递' });
  if (!password) return next({ code: 0, message: '参数password必须传递' });


  if (!userReg.test(username)) return next({ code: 5, message: '参数username格式错误' });
  if (!pwdReg.test(password)) return next({ code: 5, message: '参数password格式错误' });

  next();
}

let infoMid = (req, res, next) => {
  let { id } = req.query;
  let token = req.headers.authorization;

  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!token) return next({ code: 0, message: '请求的token必须传递' });

  next();
}

let checkToken = async (req, res, next) => {
  let id = req.query.id ?? req.body.id;
  let token = req.headers.authorization;

  // 校验该用户是否找白名单(没有被禁用的)
  let tokenData = await findTokenAll();
  let tokenList = tokenData ? JSON.parse(tokenData) : []
  let flag = tokenList.some(o => o.id == id);
  if (!flag) return next({ code: 0, message: '未登录,请重新登录' });

  // console.log(token, id)
  let { status } = await verifyToken(token, id);
  if (status != 1) return next({ code: 401, message: 'token校验失败' });
  next();
}

let rpwdMid = (req, res, next) => {
  let { id, oldPassword, newPassword, rNewPassword } = req.body;
  let token = req.headers.authorization;


  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!token) return next({ code: 0, message: '请求的token必须传递' });
  if (!oldPassword) return next({ code: 0, message: '请求的oldPassword必须传递' });
  if (!newPassword) return next({ code: 0, message: '请求的newPassword必须传递' });
  if (newPassword != rNewPassword) return res.send({ code: 0, message: '两次密码不一致' });

  if (!pwdReg.test(oldPassword)) return next({ code: 0, message: '原密码格式错误' });
  if (!pwdReg.test(newPassword)) return next({ code: 0, message: '新密码格式错误' });

  next();
}


let updMid = (req, res, next) => {
  let { id, age, gender, nickname } = req.body;  
  let token = req.headers.authorization;

  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!token) return next({ code: 0, message: '请求的token必须传递' });

  if (age && !ageReg.test(age)) return next({ code: 0, message: '参数age格式错误' });
  if (gender && !genderReg.test(gender)) return next({ code: 0, message: '参数gender格式错误' });
  if (nickname && !nickReg.test(nickname)) return next({ code: 0, message: '参数nickname格式错误' });
  next();
}


let backCheckToken = async (req, res, next) => {
  let id = req.query.id ?? req.body.id;
  let token = req.headers.authorization;

  // 校验该用户是否找白名单
  let tokenData = await findTokenAll();
  let tokenList = tokenData ? JSON.parse(tokenData) : []
  let flag = tokenList.some(o => o.id == id);
  if (!flag) return next({ code: 0, message: '未登录,请重新登录' });

  // console.log(token, id,req.url);
  let { status } = await backverifyToken(token);
  // console.log( status )
  if (status != 1) return next({ code: 401, message: 'token校验失败,没有权限' });
  next();
}


module.exports = {
  registerMid, loginMid, infoMid, checkToken, rpwdMid, updMid, backCheckToken
}