// token相关工具方法
const jwt = require('jsonwebtoken');
const { tokenKeep, secretStr } = require('../conf/index')
// 生成token
let getToken = (uid) => {
  return jwt.sign({ uid }, secretStr, { expiresIn: tokenKeep })
}

// 校验token
let verifyToken = (token, uid) => {
  return new Promise(resolve => {
    jwt.verify(token, secretStr, (err, data) => {
      if (err) resolve({ status: 0, message: 'token有误' });
      if (data.uid != uid) resolve({ status: 0, message: 'token或id有误' })
      resolve({ status: 1, message: 'token校验成功' })
    })
  })
}

// 后台校验token
let backverifyToken = (token) => {
  return new Promise(resolve => {
    jwt.verify(token, secretStr, (err, data) => {
      if (err) resolve({ status: 0, message: 'token有误' });
      // console.log(data)
      if (data.uid.role != 'admin') resolve({ status: 2, message: '没有后台权限' })
      resolve({ status: 1, message: 'token校验成功' })
    })
  })
}

module.exports = {
  getToken, verifyToken, backverifyToken
}