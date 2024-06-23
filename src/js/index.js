// 导入自定义的ajax模块，提供ajax和isLogin方法
import { ajax, isLogin } from '../utils/ajax.js';
// 导入jQuery库，用于DOM操作和事件处理
import '../lib/jquery.js';
// 导入layui库，用于创建和管理轮播图等UI组件
import '../lib/layui/layui.js';

// 封装退出登录的逻辑
async function logout() {
    // 确认用户是否真的要退出登录
    if (!confirm('确定要退出登录吗？')) return;
    // 从localStorage获取用户ID和令牌
    const id = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    // 发起异步请求到后端注销接口
    const { data: { code } } = await ajax.get('/users/logout', { params: { id }, headers: { authorization: token } });
    // 如果注销失败，提示用户
    if (code !== 1) {
        alert('注销失败');
        return;
    }
    // 从localStorage移除token和uid
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    // 更新页面上的登录状态显示
    $('.off').addClass('active');
    $('.on').removeClass('active');
}

// 检查用户是否已经登录的逻辑
(async () => {
    // 调用isLogin方法检查用户登录状态
    const { status, user } = await isLogin();
    // 如果用户已登录，更新页面显示
    if (status === 1) {
        $('.off').removeClass('active');
        $('.on').addClass('active');
        $('.nickname').text(user.nickname); // 设置昵称显示
        // 绑定点击事件到个人中心按钮，点击后跳转到个人中心页面
        $('.self').on('click', () => (location.href = './self.html'));
        // 绑定点击事件到退出登录按钮，点击后调用logout函数
        $('.logout').on('click', logout);
    }
})();

// 定义渲染轮播图的函数
async function renderCarousel() {
    // 发起异步请求获取轮播图列表
    const { data: { code, list } } = await ajax.get('/carousel/list');
    // 如果获取失败，打印失败信息到控制台
    if (code !== 1) {
        console.log('获取轮播图失败');
        return;
    }

    // 构建轮播图的HTML字符串
    let str = list.map(e => `<div><img src="${ajax.defaults.baseURL}/${e.name}"></div>`).join('');
    // 设置HTML字符串到轮播图容器中
    $('#carousel > :first-child').html(str);

    // 使用layui的carousel.render方法初始化轮播图
    layui.carousel.render({
        elem: '#carousel', // 轮播图容器的选择器
        width: '1200px', // 轮播图容器的宽度
        height: '600px', // 轮播图容器的高度
        arrow: 'hover', // 箭头的显示方式
        anim: 'fade' // 切换动画方式
    });
}

// 当文档加载完成时，调用renderCarousel函数渲染轮播图
$(document).ready(function() {
    renderCarousel();
});