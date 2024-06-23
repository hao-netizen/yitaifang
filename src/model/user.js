// 用户相关数据操作方法=====>模型 (模型----直接操作数据库的方法,代码)
// 导入的是fs 的promsie操作文件的操作方法
const fs = require('fs/promises');
// 获取所有用户信息
let findAll = async () => {
  let userData = await fs.readFile('./db/users.json', 'utf-8')
  let userList = userData ? JSON.parse(userData) : [];
  return userList;
}

// 根据用户名获取
let findByName = async (username) => {
  let userData = await fs.readFile('./db/users.json', 'utf-8');
  let userList = userData ? JSON.parse(userData) : [];
  // let userObj = userList.find(user => user.username == username);
  let userObj = userList.find(user => user.username == username); // 添加禁用条件查询
  if (userObj) return { status: 1, userObj };
  return { status: 0, message: '用户名不存在' };
}
// 根据用户id获取
let findById = async (id) => {
  let userData = await fs.readFile('./db/users.json', 'utf-8');
  let userList = userData ? JSON.parse(userData) : [];
  // console.log(id, userList);
  let userObj = userList.find(user => user.id == id);
  // console.log(userObj)
  if (userObj) return { status: 1, userObj };
  return { status: 0, message: '用户id有误,请重试' };
}


// 重写用户数据文件
let writeUsers = (userList) => {
  return fs.writeFile('./db/users.json', JSON.stringify(userList));
}

let resetPwd = async (id) => {
  let userList = await findAll();
  let userObj = userList.find(u => u.id == id);
  userObj.password = require('bcryptjs').hashSync('123456', 10);
  await writeUsers(userList);
}

let flagModel = async (id) => {
  let userList = await findAll();
  let userObj = userList.find(u => u.id == id);
  userObj.flag = !userObj.flag;
  await writeUsers(userList);
}

let delUser = async (id) => {
  let userList = await findAll();
  userList = userList.filter(u => u.id != id);
  await writeUsers(userList);
}


// 导出
module.exports = {
  findAll, findByName, writeUsers, findById, resetPwd, flagModel, delUser
}
