// 购物车模型
const fs = require('fs/promises');
const { findById } = require('./goods');

let getAll = async () => {
  let cartsData = await fs.readFile('./db/carts.json', 'utf-8');
  cartsData = cartsData ? JSON.parse(cartsData) : {}
  return cartsData;
}

let writeCarts = async (cartsData) => {
  await fs.writeFile('./db/carts.json', JSON.stringify(cartsData));
}


let addOne = async (id, goodsId) => {
  let cartsData = await getAll();
  if (Object.hasOwn(cartsData, id)) {
    let cartObj = cartsData[id].find(v => v.goodsId == goodsId);
    if (cartObj) { // 之前添加了该商品则购物数量累加
      cartObj.carts_number++; // 
    } else {
      cartsData[id].push({ goodsId, carts_number: 1, is_select: false });
    }
  } else { // 之前该用户没有购物车数据--->添加的是第一条
    cartsData[id] = [{ goodsId, carts_number: 1, is_select: false }]
  }
  writeCarts(cartsData)
}

let getCarts = async (id) => {
  let cartsData = await getAll();
  let cartsList = cartsData[id] ?? [];
  // 如果cartsList有数据则将对应的商品详情一起获取
  if (cartsList.length) {
    let r = cartsList.map(async cart => {
      let { goods } = await findById(cart.goodsId);
      return {
        goods_id: goods.goods_id, // 商品id
        title: goods.title,   // 商品标题
        img_small_logo: goods.img_small_logo, // 图片地址
        price: goods.price,  // 原价
        current_price: goods.current_price, // 现价 
        goods_number: goods.goods_number, // 库存
        cart_number: cart.carts_number, // 购买数量
        is_select: cart.is_select, // 购买数量
      }
    })
    cartsList = await Promise.all(r);
  }

  return cartsList;
}

let selectOne = async (id, goodsId) => {
  let cartsData = await getAll();
  let cartObj = cartsData[id].find(v => v.goodsId == goodsId);
  // 修改该购物车数据的选中状态
  cartObj.is_select = !cartObj.is_select;
  writeCarts(cartsData)
}

let selectAll = async (id, type) => {
  let cartsData = await getAll();
  // 修改该购物车数据的选中状态 
  cartsData[id].forEach(v => v.is_select = Boolean(type - 0));
  writeCarts(cartsData)
}

let modifyNum = async (id, goodsId, number) => {
  let cartsData = await getAll();
  let cartObj = cartsData[id].find(v => v.goodsId == goodsId);
  cartObj.carts_number = number;
  writeCarts(cartsData)
}

let removeOne = async (id, goodsId) => {
  let cartsData = await getAll();
  let i = cartsData[id].findIndex(v => v.goodsId == goodsId);
  cartsData[id].splice(i, 1);
  writeCarts(cartsData);
}

let removeSel = async (id) => {
  let cartsData = await getAll();
  cartsData[id] = cartsData[id].filter(v => !v.is_select);
  writeCarts(cartsData);
}

let clear = async (id) => {
  let cartsData = await getAll();
  delete cartsData[id];
  writeCarts(cartsData);
}


module.exports = {
  addOne, getCarts, selectOne, selectAll, modifyNum,removeOne,removeSel,clear
}