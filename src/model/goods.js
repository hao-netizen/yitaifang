// 商品相关的数据操作模型

const fs = require('fs/promises');

let findGoodsAll = async () => {
  let goodsData = await fs.readFile('./db/goods.json');
  let goodsList = goodsData ? JSON.parse(goodsData) : [];
  return goodsList;
}

let findById = async (id) => {
  let goodsList = await findGoodsAll();
  let goods = goodsList.find(o => o.goods_id == id);
  if (goods) return { status: 1, goods };
  return { status: 0, message: '商品id有误,请重试' };
}

let findCates = async () => {
  let goodsList = await findGoodsAll();
  let goodsSet = goodsList.reduce((prev, item) => prev.add(item.category), new Set())
  return [...goodsSet];
}



// opt: {current,pagesize,search,filter,saleType,sortType,sortMethod,category}
// 参数必须传递
let findList = async (opt) => {
  let goodsList = await findGoodsAll();

  let filterGoodsList = goodsList.map(v => {
    return {
      goods_id: v.goods_id, // 商品id
      title: v.title,   // 商品标题
      img_big_logo: v.img_big_logo, // 图片地址
      price: v.price,  // 原价
      current_price: v.current_price, // 现价 
      goods_number: v.goods_number, // 库存
      is_sale: v.is_sale, // 是否折扣
      is_hot: v.is_hot, // 是否热销
      sale_type: v.sale_type, // 折扣5-10
      category: v.category, // 类别
    }
  }).filter(v => {
    if (!opt.category) return true;
    return v.category == opt.category;
  }).filter(v => {
    return v.title.includes(opt.search)
  }).filter(v => {
    if (opt.filter == 'hot') return v.is_hot;
    if (opt.filter == 'sale') return v.is_sale;
    if (opt.filter == 'sale,hot' || opt.filter == 'hot,sale') return v.is_sale && v.is_hot;
    if (!opt.filter) return true;
  }).filter(v => {
    if (opt.saleType != 10) return v.sale_type == `${opt.saleType * 10}%`;
    if (opt.saleType == 10) return true;
  }).sort((a, b) => {
    if (opt.sortType == 'id' && opt.sortMethod == 'ASC') return a.id - b.id;
    if (opt.sortType == 'id' && opt.sortMethod == 'DESC') return b.id - a.id;
    if (opt.sortType == 'price' && opt.sortMethod == 'DESC') return b.current_price - a.current_price;
    if (opt.sortType == 'price' && opt.sortMethod == 'ASC') return a.current_price - b.current_price;
    if (opt.sortType == 'sale' && opt.sortMethod == 'ASC') return parseInt(a.sale_type) - parseInt(b.sale_type);
    if (opt.sortType == 'sale' && opt.sortMethod == 'DESC') return parseInt(b.sale_type) - parseInt(a.sale_type);
  })

  let curretPageList = filterGoodsList.slice((opt.current - 1) * opt.pagesize, opt.current * opt.pagesize);
  let total = Math.ceil(filterGoodsList.length / opt.pagesize);
  // 获取列表数据
  return { total, curretPageList }
}


// 导出
module.exports = {
  findGoodsAll, findById, findCates, findList
}
