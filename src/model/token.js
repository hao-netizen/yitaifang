// 和用户token白名单 相关数据操作
const fs = require('fs/promises');
let findTokenAll = () => {
  return fs.readFile('./db/token.json', 'utf-8');
}
let writeAll = (tokenList) => {
  return fs.writeFile('./db/token.json', JSON.stringify(tokenList));
}

module.exports = {
  findTokenAll, writeAll
}

