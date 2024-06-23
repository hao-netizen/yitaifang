// 导入模型
const { addOne, getCarts, selectOne, selectAll, modifyNum, removeOne, removeSel, clear } = require('../model/carts');
const { findById } = require('../model/goods')
// 商品控制器
let addCon = async (req, res, next) => {
  let { id, goodsId } = req.body;

  // 获取goodsId对应商库存
  let { goods } = await findById(goodsId);
  let goods_number = goods.goods_number; // 库存

  // 获取之前加入购物车的数量
  let list = await getCarts(id);
  let r = list.find(c => c.goods_id == goodsId);
  if (r && r.cart_number >= goods_number) return res.send({ code: 3, message: '购买数量超出库存' })

  await addOne(id, goodsId)
  res.send({
    "message": "加入购物车成功 ! 你太有钱了 ! O(∩_∩)O哈哈~",
    "code": 1
  })
}

let listCon = async (req, res, next) => {
  let { id } = req.query;
  let list = await getCarts(id);
  res.send({
    "message": "获取购物车列表成功",
    "code": 1,
    "yourParams": {
      "msg": "这是你带来的参数, 我带回去给你看看 ^_^", id
    },
    "cart": list
  })
}

let selCon = async (req, res, next) => {
  let { id, goodsId } = req.body;
  await selectOne(id, goodsId);

  res.send({
    "message": "修改购买信息成功",
    "code": 1,
  })
}

let allCon = async (req, res, next) => {
  let { id, type } = req.body;

  await selectAll(id, type);
  res.send({
    "message": "修改全部购买信息成功",
    "code": 1,
  })
}

let numCon = async (req, res, next) => {
  let { id, goodsId, number } = req.body;

  // 获取goodsId对应商库存
  let { goods } = await findById(goodsId);
  let goods_number = goods.goods_number; // 库存
  if (number > goods_number) return res.send({ code: 3, message: '购买数量超出库存' })
  await modifyNum(id, goodsId, number);
  res.send({
    "message": "修改购买数量成功!",
    "code": 1,
  })
}

let removeCon = async (req, res, next) => {
  let { id, goodsId } = req.query;
  await removeOne(id, goodsId);
  res.send({
    "message": "删除商品成功",
    "code": 1
  })
}

let removeSelCon = async (req, res, next) => {
  let { id } = req.query;
  await removeSel(id);
  res.send({
    "message": "删除商品成功",
    "code": 1
  })
}

let clearCon = async (req, res, next) => {
  let { id } = req.query;
  await clear(id);
  res.send({
    "message": "清除购物车成功",
    "code": 1
  })
}

let pay = (req, res, next) => {
  res.send({
    "message": "跳转支付页面中.....等待升级",
    "code": 1
  })

}

module.exports = {
  addCon, listCon, selCon, allCon, numCon, removeCon, removeSelCon, clearCon, pay
}