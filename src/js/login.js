// 导入jQuery库，用于DOM操作和事件处理
import '../lib/jquery.js';
// 导入自定义的ajax模块，提供ajax功能
import { ajax } from '../utils/ajax.js';
// 导入正则表达式校验工具，用于用户名和密码的格式校验
import { nameTest, pwdTest } from "../utils/reg.js";

// 预先使用jQuery选择DOM元素，并缓存结果以提高性能
const $form = $('form');
const $username = $('.username'); // 选择用户名输入框
const $password = $('.password'); // 选择密码输入框
const $error = $('.error'); // 选择错误信息显示元素

// 封装错误提示函数，使用alert展示错误信息，并显示错误提示元素
function showError(message) {
    alert(message);
    $error.css('display', 'block');
}

// 封装表单数据验证逻辑
function validateFormData() {
    const username = $username.val(); // 获取用户名输入框的值
    const password = $password.val(); // 获取密码输入框的值
    
    // 校验用户名和密码是否为空
    if (!username || !password) {
        return false;
    }
    // 使用正则表达式校验用户名和密码格式
    if (!nameTest(username)) {
        showError('用户名格式错误');
        return false;
    }
    if (!pwdTest(password)) {
        showError('密码格式错误');
        return false;
    }
    // 如果所有校验通过，则返回true
    return true;
}

// 为表单绑定提交事件
$form.on('submit', async e => {
    e.preventDefault(); // 阻止表单的默认提交行为
    
    // 校验表单数据是否有效
    if (!validateFormData()) {
        return;
    }

    // 使用try-catch语句捕获异步操作中的错误
    try {
        // 发起异步POST请求进行登录
        const response = await ajax.post('/users/login', {
            username: $username.val(),
            password: $password.val()
        });
        const { code, token, user } = response.data; // 解构响应数据
        
        // 校验后端返回的code，判断登录是否成功
        if (code !== 1) {
            // 如果登录失败，抛出错误
            throw new Error('登录失败');
        }
        
        // 登录成功，将token和用户id保存到localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('uid', user.id);
        
        // 重定向到主页
        location.href = './index.html';
    } catch (error) {
        // 捕获并展示异步操作中的错误信息
        showError(error.message || '未知错误');
    }
});