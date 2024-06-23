// API接口服务的 配置信息
module.exports = {
  // 保持用户登录状态
  keep: true,
  // token有效时间-token秘钥
  tokenKeep: 60 * 60,
  secretStr: 'gccleon',
  // 正则表达表达式
  userReg: /^[a-z0-9]\w{3,11}$/,
  pwdReg: /\w{6,12}/,
  ageReg: /^[1-9]\d{1,2}$/,
  nickReg: /^[\u4e00-\u9fa5]{2,5}$/,
  genderReg:/^(男|女)$/
}