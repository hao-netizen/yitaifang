// 导入jQuery库
import '../lib/jquery.js';
// 导入自定义的ajax函数
import { ajax } from '../utils/ajax.js';
// 导入正则表达式测试函数
import { nameTest, pwdTest, nickTest } from '../utils/reg.js';

// 表单验证函数
const validateForm = (username, password, rpassword, nickname) => {
    // 检查所有输入字段是否为空
    if (!username || !password || !rpassword || !nickname) {
        alert('表单不能为空');
        return false;
    }
    // 使用正则表达式验证用户名格式
    if (!nameTest(username)) {
        alert('用户名格式错误');
        return false;
    }
    // 使用正则表达式验证密码格式
    if (!pwdTest(password)) {
        alert('密码格式错误');
        return false;
    }
    // 使用正则表达式验证昵称格式
    if (!nickTest(nickname)) {
        alert('昵称格式错误');
        return false;
    }
    // 检查两次输入的密码是否一致
    if (password !== rpassword) {
        alert('两次密码不一致');
        return false;
    }
    // 如果所有验证通过，返回true
    return true;
};

// 表单提交处理函数
const handleSubmit = async (e) => {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 获取表单字段的值
    const username = $('.username').val();
    const password = $('.password').val();
    const rpassword = $('.rpassword').val();
    const nickname = $('.nickname').val();

    // 调用验证函数，如果验证失败则不执行后续操作
    if (!validateForm(username, password, rpassword, nickname)) return;

    try {
        // 组织提交的数据
        const data = { username, password, rpassword, nickname };
        // 发起异步请求进行注册
        const response = await ajax.post('/users/register', data);
        // 检查服务器响应的code，如果不等于1则显示错误信息
        if (response.data.code !== 1) {
            $('.error').css('display', 'block');
            return;
        }
        // 注册成功，提示用户并跳转到登录页面
        alert('注册成功，点击确定跳转到登录页面');
        document.location.href = './login.html';
    } catch (error) {
        // 捕获并处理异步请求过程中的错误
        console.error('注册失败:', error);
        $('.error').text('注册失败，请稍后再试').css('display', 'block');
    }
};

// 为表单的提交事件绑定处理函数
$('form').on('submit', handleSubmit);