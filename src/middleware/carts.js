// 购物车中间件
let addMid = (req, res, next) => {
  let { id, goodsId } = req.body;

  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!goodsId) return next({ code: 0, message: '参数goodsId必须传递' });

  if (!/^[1-9]\d*$/.test(id)) return next({ code: 0, message: '参数id格式错误' });
  if (!/^[1-9]\d*$/.test(goodsId)) return next({ code: 0, message: '参数goodsId格式错误' });
  next();
}

let idMid = (req, res, next) => {
  let { id } = req.query;
  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!/^[1-9]\d*$/.test(id)) return next({ code: 0, message: '参数id格式错误' });
  next();
}

let allMid = (req, res, next) => {
  let { id, type } = req.body;
  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!type) return next({ code: 0, message: '参数type必须传递' });
  if (!/^[1-9]\d*$/.test(id)) return next({ code: 0, message: '参数id格式错误' });
  if (!/^(0|1)$/.test(type)) return next({ code: 0, message: '参数type格式错误' });
  next();
}

let numMid = (req, res, next) => {
  let { id, goodsId, number } = req.body;
  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!goodsId) return next({ code: 0, message: '参数goodsId必须传递' });
  if (!number) return next({ code: 0, message: '参数number必须传递' });

  if (!/^[1-9]\d*$/.test(id)) return next({ code: 0, message: '参数id格式错误' });
  if (!/^[1-9]\d*$/.test(goodsId)) return next({ code: 0, message: '参数goodsId格式错误' });
  if (!/^[1-9]\d*$/.test(number)) return next({ code: 0, message: '参数number格式错误' });
  next();
}

let removeMid = (req, res, next) => {
  let { id, goodsId } = req.query;

  if (!id) return next({ code: 0, message: '参数id必须传递' });
  if (!goodsId) return next({ code: 0, message: '参数goodsId必须传递' });

  if (!/^[1-9]\d*$/.test(id)) return next({ code: 0, message: '参数id格式错误' });
  if (!/^[1-9]\d*$/.test(goodsId)) return next({ code: 0, message: '参数goodsId格式错误' });
  next();
}


module.exports = {
  addMid, idMid, allMid, numMid, removeMid
}