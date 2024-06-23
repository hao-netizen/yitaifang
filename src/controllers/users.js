const bcryptjs = require('bcryptjs');
const { getToken } = require('../utils/token');

const { findAll, findByName, writeUsers, findById, resetPwd, flagModel, delUser } = require('../model/user')
const { findTokenAll, writeAll } = require('../model/token');
const user = require('../middleware/user');

/* 前台用户相关控制器 */
let registerCon = async (req, res, next) => {
  let { username, password, nickname } = req.body;

  // 读取文件获取所有用户数据
  let userList = await findAll();

  // 判断用户名是否存在(是否已经注册)
  let flag = userList.some(userObj => userObj.username == username);
  if (flag) return next({ code: 0, message: '用户名已存在,请修改重试' });

  // 写入  
  let id = Date.now() + Math.random().toString(16).slice(-6);
  userList.push({ id, username, password: bcryptjs.hashSync(password, 10), nickname, role: 'youke', flag: true })

  // 写会用户文件中
  let r = await writeUsers(userList).catch(err => { return { code: 0, message: '写入失败,请重试' } })
  if (r) return next({ code: 0, message: '注册失败,请重试' })
  res.send({ code: 1, message: '恭喜注册成功!' });
}

let loginCon = async (req, res, next) => {
  let { username, password } = req.body;
  let { status, userObj, message } = await findByName(username);
  if (status != 1) return res.send({ code: 0, message }) // 用户名不存在
  if (!userObj.flag) return res.send({ code: 0, message: '该用户无法使用,请联系管理员' }) //
  // 校验密码
  if (!bcryptjs.compareSync(password, userObj.password)) return res.send({ code: 0, message: '用户名或密码错误' });

  // 生成token
  let token = getToken(userObj.id);

  delete userObj.password;
  res.send({ code: 1, message: '恭喜登录成功', token, user: userObj })

  // 写入token到白名单
  let tokenData = await findTokenAll();
  let tokenList = tokenData ? JSON.parse(tokenData) : []

  let tokenObj = tokenList.find(o => o.id == userObj.id);
  // 修改tokenList
  tokenObj ? tokenObj.token = token : tokenList.push({ id: userObj.id, token })
  await writeAll(tokenList);
}

let infoCon = async (req, res, next) => {
  let { id } = req.query;
  let { status, userObj } = await findById(id);
  if (status != 1) return next({ code: 0, message: '获取用户信息失败,请重试' });
  delete userObj.password;
  res.send({ code: 1, message: '获取用户信息成功', user: userObj })
}


let outCon = async (req, res, next) => {
  let { id } = req.query;
  let tokenData = await findTokenAll();
  let tokenList = tokenData ? JSON.parse(tokenData) : []
  tokenList = tokenList.filter(o => o.id != id);
  await writeAll(tokenList);
  res.send({ code: 1, message: '注销成功' });
}

let rpwdCon = async (req, res, next) => {
  let { id, oldPassword, newPassword } = req.body;

  let userList = await findAll();
  userObj = userList.find(o => o.id == id);
  // 比对原密码
  if (!bcryptjs.compareSync(oldPassword, userObj.password)) return res.send({ code: 0, message: '原密码输入有误' });
  userObj.password = bcryptjs.hashSync(newPassword, 10);
  await writeUsers(userList);

  // 注销登录状态
  let tokenData = await findTokenAll();
  let tokenList = tokenData ? JSON.parse(tokenData) : []
  tokenList = tokenList.filter(o => o.id != id);
  await writeAll(tokenList);

  res.send({ code: 1, message: '修改密码成功, 已经注销登录状态, 请重新登录 ! ^_^' });
}

let updCon = async (req, res, next) => {
  let { id, age, gender, nickname } = req.body;

  let userList = await findAll();
  userObj = userList.find(o => o.id == id);

  // 接受了参数写修改
  if (age) userObj.age = age;
  if (gender) userObj.gender = gender;
  if (nickname) userObj.nickname = nickname;

  await writeUsers(userList);

  delete userObj.password;
  res.send({ code: 1, message: '修改用户信息成功 ! O(∩_∩)O哈哈~', user: userObj });
}

/* 后台控制器 */
let backLoginCon = async (req, res, next) => {
  let { username, password } = req.body;
  let { status, userObj, message } = await findByName(username);
  if (status != 1) return res.send({ code: 0, message }) // 用户名不存在

  // 角色(权限)校验
  if (userObj.role != 'admin') return res.send({ code: 0, message: '没有后台权限,非法访问!' });
  // 校验密码
  if (!bcryptjs.compareSync(password, userObj.password)) return res.send({ code: 0, message: '用户名或密码错误' });

  // 生成token
  let token = getToken({ id: userObj.id, role: 'admin' });

  delete userObj.password;
  res.send({ code: 1, message: '恭喜登录成功', token, user: userObj })

  // 写入token到白名单
  let tokenData = await findTokenAll();
  let tokenList = tokenData ? JSON.parse(tokenData) : []

  let tokenObj = tokenList.find(o => o.id == userObj.id);
  // 修改tokenList
  tokenObj ? tokenObj.token = token : tokenList.push({ id: userObj.id, token })
  await writeAll(tokenList);
}

let listCon = async (req, res, next) => {
  let userList = await findAll();  
  userList.forEach(u => delete u.password);
  res.send({ code: 1, list: userList.filter(u => u.role != 'admin') })
}

let searchCon = async (req, res, next) => {
  let { searchStr } = req.query;
  let userList = await findAll();
  let list = userList.filter(u => u.username.includes(searchStr) || u.age?.includes(searchStr) || u.gender?.includes(searchStr) || u.nickname.includes(searchStr));
  res.send({ code: 1, list: list.filter(u => u.role != 'admin') })
}

let resetCon = async (req, res, next) => {
  let { uid } = req.body;
  if (!uid) return next({ code: 0, message: '参数id必须传递' })

  await resetPwd(uid);

  res.send({ code: 1, message: '重置密码成功' })
}

let flagCon = async (req, res, next) => {
  let { uid } = req.body;
  if (!uid) return next({ code: 0, message: '参数id必须传递' })

  await flagModel(uid);

  res.send({ code: 1, message: '操作成功' })
}

let delCon = async (req, res, next) => {
  let { uid } = req.body;
  if (!uid) return next({ code: 0, message: '参数id必须传递' })

  await delUser(uid);

  res.send({ code: 1, message: '操作成功' })
}

// 创建验证码
const captcha = require('svg-captcha');
let codeCon = (req, res) => {
  let captchaObj = captcha.create({
    size: 4,
    color: true,
    noise: 5,
    width: 80,
    height: 38,
    fontSize: 50
  })
  // 返回值: {text:验证码,data:验证码的svg图片}
  res.send({
    code: 1,
    msg: '获取验证码成功',
    data: captchaObj
  })
}

module.exports = {
  registerCon, loginCon, infoCon, outCon, rpwdCon, updCon, backLoginCon, listCon, searchCon, resetCon, flagCon, delCon, codeCon
}
