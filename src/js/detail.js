// 导入自定义的ajax模块，用于发送HTTP请求
import { ajax } from '../utils/ajax.js';
// 导入jQuery库，用于简化DOM操作和事件处理
import '../lib/jquery.js'

// 使用jQuery的ajaxError方法设置一个全局Ajax错误处理函数
// 当任何Ajax请求发生错误时，会触发此函数
$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    // 弹出错误信息的警告框
    alert(thrownError); 
    // 错误发生后，重定向到list.html页面
    window.location.href = './list.html';
});

// 定义一个异步函数render，用于在页面上渲染商品的详细信息
async function render() {
    // 获取商品ID，优先从document.body的data属性中获取，如果没有则尝试从sessionStorage中获取
    const id = $.data(document.body, 'id') || sessionStorage.getItem('id');

    // 如果没有获取到商品ID，显示错误信息并终止函数执行
    if (!id) {
        showError('非法访问');
        return;
    }

    try {
        // 发起异步HTTP GET请求，获取商品详情
        const response = await ajax.get(`/goods/item/${id}`);
        // 检查响应中的状态码，如果不等于1，则抛出错误
        if (response.data.code !== 1) {
            throw new Error('获取商品详情失败');
        }

        // 从响应数据中获取商品信息
        const info = response.data.info;

        // 使用jQuery更新页面上对应的元素内容
        $('.title').text(info.title);
        $('.middleimg').attr('src', info.img_big_logo);
        $('.desc').html(info.goods_introduce);
        $('.old').text(`￥${info.price}`);
        // 计算折扣并更新到页面上
        $('.discount').text(`折扣: ${((info.current_price / info.price) * 100).toFixed(2)}%`);
        $('.curprice').text(`￥${info.current_price}`);

        // 添加CSS类以反映商品详情已加载
        $('.goods-detail').addClass('loaded');
    } catch (error) {
        // 打印错误到控制台
        console.error(error);
        // 调用showError函数显示错误信息
        showError(error.message);
    }
}

// 定义showError函数，用于显示错误信息
function showError(message) {
    // 使用alert弹窗显示错误信息，实际应用中可能需要更复杂的错误显示逻辑
    alert(message);
}

// 在文档加载完成后，将商品ID存储到document.body的data属性中
// 这样，即使页面刷新，商品ID也不会丢失
$(document).ready(function() {
    $.data(document.body, 'id', sessionStorage.getItem('id'));
});

// 调用render函数，开始渲染商品详情
render();