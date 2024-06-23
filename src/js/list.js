// 导入jQuery库，用于DOM操作和事件处理
import '../lib/jquery.js';
// 导入自定义的ajax模块，提供ajax功能
import { ajax } from '../utils/ajax.js';

// 使用一个立即执行函数表达式（IIFE）来避免变量污染全局命名空间
// 预先选择页面上需要操作的DOM元素，并将选择结果存储在对象的属性中
const {
    listBox, categoryBox, filterBox, saleBox, sortBox, searchBox,
    firstBtn, prevBtn, nextBtn, lastBtn,
    totalBox, pagesizeBox, jumpBox, jumpBtn
} = (() => {
    return {
        // 列表显示区域
        listBox: $('.list'),
        // 分类筛选区域
        categoryBox: $('.category'),
        // 热销/折扣筛选区域，使用.first()确保只选择第一个.filterBox元素
        filterBox: $('.filterBox').first(),
        // 折扣筛选区域
        saleBox: $('.saleBox'),
        // 排序筛选区域
        sortBox: $('.sortBox'),
        // 搜索框
        searchBox: $('.search'),
        // 分页按钮：首页
        firstBtn: $('.first'),
        // 分页按钮：上一页
        prevBtn: $('.prev'),
        // 分页按钮：下一页
        nextBtn: $('.next'),
        // 分页按钮：末页
        lastBtn: $('.last'),
        // 显示当前页码和总页数的区域
        totalBox: $('.total'),
        // 每页显示条数的选择区域
        pagesizeBox: $('.pagesize'),
        // 跳转到指定页码的输入框
        jumpBox: $('.jump'),
        // 跳转按钮
        jumpBtn: $('.go')
    };
})();

// 定义总页数变量，用于记录商品列表的总页数
let totalPage;

// 定义请求发送的数据对象，存储商品列表请求所需的参数
const data = {
    // 当前页码
    current: 1,
    // 每页显示的条数
    pagesize: 12,
    // 搜索关键字
    search: '',
    // 筛选条件：热销或折扣
    filter: '',
    // 折扣类型，范围5到10
    saleType: 10,
    // 排序类型：id、折扣或价格
    sortType: 'id',
    // 排序方式：正序或倒序
    sortMethod: 'ASC',
    // 分类筛选条件
    category: ''
};
//渲染分类列表
async function renderCategory(){
    //请求 category 获取分类列表
    let {data: {code, list}} = await ajax.get('/goods/category');
    if (code != 1) return console.log('获取分类列表失败');

    //清空原本的
    categoryBox.empty();

    //分类列表里面没有 '全部'，所以一开始就加进去
    let str = `<li class="active">全部</li>`;
    //遍历分类列表添加
    list.forEach(e => str += `<li>${e}</li>`);
    //渲染到页面上
    categoryBox.html(str);
}
renderCategory();

//渲染商品列表
async function renderList() {
    //发送 data，请求商品列表
    let {data: {code, list, total}} = await ajax.get('/goods/list', {params: data});
    if (code != 1) return console.log('获取商品列表失败');

    //渲染列表
    let str = ``;
    list.forEach(e => {
        str += `<li data-id="${e.goods_id}">
                    <div class="show">
                        <img src="${e.img_big_logo}">
                        ${e.is_hot ? '<span class="hot">热销</span>' : ''}
                        ${e.is_sale ? '<span>折扣</span>' : ''}
                    </div>
                    <div class="info">
                        <p class="title">${e.title}</p>
                        <p class="price">
                            <span class="curr">¥ ${e.current_price}</span>
                            <span class="old">¥ ${e.price}</span>
                        </p>        
                    </div>
                </li>`
    })
    //没有时显示 nothing 图片，并且页数全是 0
    if (list.length == 0) {
        data.current = 0;
        str = '<img src="../img/no.png" alt="">';
    }
    listBox.html(str);

    // 当前页 / 总页数
    totalPage = total;
    totalBox.text(`${data.current} / ${totalPage}`);
    //跳转改为当前页
    jumpBox.val(`${data.current}`);

    //先把首页，末页，上一页，下一页全部设置成能按
    prevBtn.removeClass('disable');
    nextBtn.removeClass('disable');
    firstBtn.removeClass('disable');
    lastBtn.removeClass('disable');
    //再判断当前页在哪， <= 1 首页跟上一页就不能按
    if (data.current <= 1) {
        prevBtn.addClass('disable');
        firstBtn.addClass('disable');
    }
    // == 总页数（最后一页） 下一页跟末页就不能按
    if (data.current == totalPage) {
        nextBtn.addClass('disable');
        lastBtn.addClass('disable');
    }
}
renderList();

//分类
categoryBox.on('click', ({target}) => {
    //如果点击的是 <li>
    if (target.nodeName == 'LI') {
        //所有 <li> 删除 active 类
        categoryBox.children().removeClass('active');
        //点击的那个 li 加上 active
        target.classList.add('active');
        //获取点击的文本
        let str = target.innerText;
        //前面有说，空串表示全部
        if (str == '全部') str = '';
        //修改 data 的 category 属性
        data.category = str;
        //重新渲染
        renderList();
    }
})

//首页 末页
firstBtn.on('click', () => {
    //将当前页设为 1，重新渲染，别的都一样的了，如法炮制
    data.current = 1;
    renderList();
})
lastBtn.on('click', () => {
    data.current = totalPage;
    renderList();
})
//上一页 下一页
prevBtn.on('click', () => {
    if (data.current > 1) data.current--;
    renderList();
})
nextBtn.on('click', () => {
    if (data.current < totalPage) data.current++;
    renderList();
})
//跳转
jumpBtn.on('click', () => {
    //获取跳转页的值
    let target = jumpBox.val();
    //判断是否在范围内
    if (target < 1 || target > totalPage) return alert('跳转页不合法');
    //将当前页标为要跳转的页数
    data.current = target;
    renderList();
})

//一页显示几条
pagesizeBox.on('change', () => {
    //获取值
    data.pagesize = pagesizeBox.val();
    //修改一页个数 -> 总页数减少 -> 可能当前页会超出总页数
    //懒人直接设置为 1
    data.current = 1;
    renderList();
})

// 热销/折扣
filterBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        //把 li 的 active 豆沙了
        filterBox.children().removeClass('active');
        //当前点击的 li 添加 active
        target.classList.add('active');
        //获取分类类型
        data.filter = target.dataset.type;
        //总页数可能会减少，导致当前页超出总页数，所以直接标为 1
        data.current = 1;
        renderList();
    }
})
//几折
saleBox.on('click', ({target}) => {
    //跟上面一样的
    if (target.nodeName == 'LI') {
        saleBox.children().removeClass('active');
        target.classList.add('active');
        data.saleType = target.dataset.type;
        data.current = 1;
        renderList();
    }
})
//排序
sortBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        sortBox.children().removeClass('active');
        target.classList.add('active');
        //获取排序类型（id、折扣、价格）
        data.sortType = target.dataset.type;
        //获取排序方法（正序、倒序）
        data.sortMethod = target.dataset.method;
        data.current = 1;
        renderList();
    }
})
//搜索
searchBox.on('input', () => {
    //当搜索框输入时，获取值
    data.search = searchBox.val();
    data.current = 1;
    //重新渲染
    renderList();
})
//商品详情
listBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        //获取点击的商品的 id
        let id = target.dataset.id;
        //存在会话里面
        sessionStorage.setItem('id', id);
        //跳转到详情页
        location.href = './detail.html';
    }
})