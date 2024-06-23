// 导入自定义的ajax模块和isLogin方法，用于发起HTTP请求和检查登录状态
import { ajax, isLogin } from '../utils/ajax.js';
// 导入jQuery库，用于DOM操作和事件处理
import '../lib/jquery.js';
// 导入正则表达式校验工具，用于密码格式校验
import { pwdTest } from "../utils/reg.js";

(async () => {
    // 预先使用jQuery选择DOM元素，并缓存结果以提高性能
    const $oldPassword = $('.oldpassword'); // 选择旧密码输入框
    const $newPassword = $('.newpassword'); // 选择新密码输入框
    const $rNewPassword = $('.rnewpassword'); // 选择重复新密码输入框
    const $form = $('form'); // 选择表单

    // 封装错误提示函数，使用alert展示错误信息
    const showError = (message) => alert(message);

    // 封装HTTP请求函数，支持不同HTTP方法并处理响应和错误
    const request = async (url, method, data, headers) => {
        try {
            const response = await ajax[method](url, data, { headers });
            const { code } = response.data;
            if (code !== 1) {
                // 如果响应码不是1，抛出错误
                throw new Error(response.data.message || '请求失败');
            }
            return response;
        } catch (error) {
            // 展示错误信息，并向上抛出错误
            showError(error.message);
            throw error;
        }
    };

    // 判断用户是否登录
    const { status, user, token } = await isLogin();
    if (status !== 1) {
        // 如果用户未登录，展示错误并重定向到登录页面
        showError('请先登录！');
        location.href = './login.html';
        return; // 退出自执行函数
    }

    // 表单提交事件处理器
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // 阻止表单的默认提交行为
        
        const oldPassword = $oldPassword.val(); // 获取旧密码输入框的值
        const newPassword = $newPassword.val(); // 获取新密码输入框的值
        const rNewPassword = $rNewPassword.val(); // 获取重复新密码输入框的值

        // 校验所有字段是否已填写
        if (!oldPassword || !newPassword || !rNewPassword) {
            showError('所有字段都不能为空');
            return;
        }
        // 使用正则表达式校验新密码格式
        if (!pwdTest(newPassword)) {
            showError('新密码格式错误');
            return;
        }
        // 校验两次输入的新密码是否一致
        if (newPassword !== rNewPassword) {
            showError('两次密码不一致');
            return;
        }

        // 发送更新密码请求
        await request('/users/rpwd', 'post', { id: user.id, oldPassword, newPassword, rNewPassword }, { authorization: token });

        // 修改密码后操作，清除localStorage中的token和uid
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        // 提示用户修改成功，并跳转到登录页面
        alert('修改成功，点击确定跳转至登录页面');
        location.href = './login.html';
    };

    // 绑定表单提交事件
    $form.on('submit', handleFormSubmit);
})();