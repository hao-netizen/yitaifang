// 导入模型
const { findFileAll, writeAll } = require('../model/carousel');

let addCon = async (req, res, next) => {
  // console.log(req.file);
  if (!req.file) return res.send({ code: 0, message: '上传失败' });
  let fileList = await findFileAll();
  // console.log(fileList);
  
  let id = Date.now() + Math.random().toString(16).slice(-6);
  let data = { id, name: req.file.filename }
  fileList.push(data);
  await writeAll(fileList);
  res.send({ code: 1, message: '上传成功', data });
}


let listCon = async (req, res, next) => {
  let fileList = await findFileAll();
  res.send({ code: 1, messsage: '获取轮播图列表成功', list: fileList })
}

let removeCon = async (req, res, next) => {
  let { imgId } = req.body;
  let fileList = await findFileAll();
  fileList = fileList.filter(fileObj => {
    // 删除图片
    if (fileObj.id == imgId) require('fs').unlinkSync(`./public/carousel/${fileObj.name}`);
    return fileObj.id != imgId
  });

  await writeAll(fileList);
  res.send({ code: 1, message: '删除成功' });
}


let addManyCon = async (req, res, next) => {
  if (!req.files) return res.send({ code: 0, message: '上传失败' });
  let fileList = await findFileAll();  
  ;[...req.files].forEach(file => {
    let id = Date.now() + Math.random().toString(16).slice(-6);
    let data = { id, name: file.filename }
    fileList.push(data);
  })
  await writeAll(fileList);
  res.send({ code: 1, message: '上传成功'});
}

module.exports = {
  addCon, listCon, removeCon, addManyCon
}