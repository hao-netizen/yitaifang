// 导入自定义的ajax模块和isLogin方法，用于发起HTTP请求和检查登录状态
import { ajax, isLogin } from '../utils/ajax.js';
// 导入jQuery库，用于DOM操作和事件处理
import '../lib/jquery.js';
// 导入正则表达式校验工具，用于年龄、性别和昵称的格式校验
import { nickTest, sexTest, ageTest } from "../utils/reg.js";

(async () => {
    // 预先使用jQuery选择DOM元素，并缓存结果以提高性能
    const $username = $('.username'); // 选择用户名显示元素
    const $age = $('.age'); // 选择年龄输入框
    const $gender = $('.gender'); // 选择性别输入框
    const $nickname = $('.nickname'); // 选择昵称输入框
    const $form = $('form'); // 选择表单

    // 封装错误提示函数，使用alert展示错误信息
    const showError = (message) => alert(message);

    // 封装数据提交逻辑
    const submitUpdate = async (data) => {
        try {
            // 发起异步POST请求更新用户信息
            const response = await ajax.post('/users/update', data, {
                headers: { authorization: token } // 从本地存储或全局变量传递认证信息
            });
            // 校验后端返回的code，判断更新是否成功
            if (response.data.code !== 1) {
                // 如果更新失败，抛出错误
                throw new Error('更新失败');
            }
            // 如果更新成功，提示用户
            alert('修改成功');
        } catch (error) {
            // 展示错误信息
            showError(error.message || '未知错误');
        }
    };

    // 判断用户是否登录
    const { status, user, token } = await isLogin();
    if (status !== 1) {
        // 如果用户未登录，展示错误并重定向到登录页面
        showError('请先登录！');
        location.href = './login.html';
        return;
    }

    // 将原本的个人数据渲染到页面上
    $username.val(user.username); // 设置用户名显示
    $age.val(user.age); // 设置年龄输入框的值
    $gender.val(user.gender); // 设置性别输入框的值
    $nickname.val(user.nickname); // 设置昵称输入框的值

    // 表单提交事件处理器
    $form.on('submit', async (e) => {
        e.preventDefault(); // 阻止表单的默认提交行为

        const age = $age.val(); // 获取年龄输入框的值
        const gender = $gender.val(); // 获取性别输入框的值
        const nickname = $nickname.val(); // 获取昵称输入框的值

        // 校验所有字段是否已填写
        if (!age || !gender || !nickname) {
            showError('所有字段都不能为空');
            return;
        }
        // 使用正则表达式校验年龄、性别和昵称格式
        if (!ageTest(age)) {
            showError('年龄格式错误');
            return;
        }
        if (!sexTest(gender)) {
            showError('性别格式错误');
            return;
        }
        if (!nickTest(nickname)) {
            showError('昵称格式错误');
            return;
        }

        // 提交更新请求，携带用户ID和表单数据
        await submitUpdate({ id: user.id, age, gender, nickname });
    });
})();