// 商品控制器

// 导入商品模型
const { findById, findCates, findList } = require('../model/goods')
let cateCon = async (req, res) => {
  let catesList = await findCates();
  res.send({ code: 1, message: '获取分类列表成功', list: catesList })
}

let detailCon = async (req, res, next) => {
  let id = req.params?.id ?? req.query.id;
  let { status, goods } = await findById(id);
  if (status != 1) return next({ code: 0, message: '获取商品失败,请重试' })
  res.send({
    "message": "获取商品详细信息成功",
    "code": 1,
    "yourParams": {
      "msg": "这里是你传递过来的参数, 带给你看看 ^_^ ", id,
    },
    "info": goods
  })
}


let listCon = async (req, res, next) => {
  let { current, pagesize, search, filter, saleType, sortType, sortMethod, category } = req.query;
  // 参数默认值
  let info = {
    current: current ?? 1,
    pagesize: pagesize ?? 12,
    search: search ?? '',
    filter: filter ?? '',
    saleType: saleType ?? 10,
    sortType: sortType ?? 'id',
    sortMethod: sortMethod ?? 'ASC',
    category: category ?? '',
  }
  let r = await findList(info);

  res.send({
    message: "获取商品列表成功",
    code: 1,
    yourParams: {
      msg: "这里是你传递过来的参数, 带给你看看 ^_^ ",
      params: { ...info }
    },
    list: r.curretPageList,
    total: r.total
  })
}
module.exports = {
  cateCon, detailCon, listCon
}

