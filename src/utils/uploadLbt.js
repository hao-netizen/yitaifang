// 文件上传
const multer = require('multer');

// 配置存储过程
let storage = multer.diskStorage({
  destination(req, file, next) { // 配置文件存储位置
    next(null, './public/carousel');
  },
  filename(req, file, next) { // 配置文件名
    let fN = Date.now() + Math.random().toString(16).slice(-5) + '.' + file.originalname.split('.').at(-1);
    next(null, fN)
  }
})
// 过滤文件
let fileFilter = (req, file, next) => {
  next(null, file.mimetype.startsWith('image'));
}

// 创建文件接受器
let upload = multer({ storage, fileFilter })

// 创建单文件上传 中间件 ===> 固定字段 'carousel'
let uploadOne = upload.single('carousel');
let uploadMany = upload.array('carousel');

module.exports = { uploadOne,uploadMany }