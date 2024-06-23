
let detailMid = (req, res, next) => {
  let id = req.params?.id ?? req.query.id;

  if (!id) return next({ code: 0, message: '参数id必须传递' });

  if (!/^[1-9]\d*$/.test(id)) return next({ code: 0, message: '参数id格式错误' });

  next();
}


let listMid = async (req, res, next) => {
  let { current, pagesize, filter, saleType, sortType, sortMethod, category } = req.query;
  if (current && !/^[1-9]\d*$/.test(current)) return next({ code: 0, message: '参数current格式错误' });
  if (pagesize && !/^[1-9]\d*$/.test(pagesize)) return next({ code: 0, message: '参数pagesize格式错误' });
  if (filter && !/^(sale|hot|sale,hot|hot,sale)$/.test(filter)) return next({ code: 0, message: '参数filter格式错误' });
  if (saleType && !/^(5|6|7|8|9|10)$/.test(saleType)) return next({ code: 0, message: '参数saleType格式错误' });
  if (sortType && !/^(id|price|sale)$/.test(sortType)) return next({ code: 0, message: '参数sortType格式错误' });
  if (sortMethod && !/^(ASC|DESC)$/.test(sortMethod)) return next({ code: 0, message: '参数sortMethod格式错误' });
  let catesList = await require('../model/goods').findCates();
  if (category && !catesList.includes(category)) return next({ code: 0, message: '参数category类别不存在' });
  next();
}



module.exports = {
  detailMid, listMid
}