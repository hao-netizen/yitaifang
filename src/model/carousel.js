// 轮播图文件记录 相关数据操作
const fs = require('fs/promises');
let findFileAll = async () => {
  let fileData = await fs.readFile('./db/carousel.json', 'utf-8');
  return fileData ? JSON.parse(fileData) : [];
}
let writeAll = (tokenList) => {
  return fs.writeFile('./db/carousel.json', JSON.stringify(tokenList));
}

module.exports = {
  findFileAll, writeAll
}
