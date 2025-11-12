document.addEventListener('DOMContentLoaded', () => {
    // ========== 1. 缓存所有DOM元素（避免重复查询） ==========
    const $toggleCode = document.getElementById('toggle-code');
    const $input = document.getElementById('password-or-code');
    const $forgotLink = document.getElementById('forgot-action');
    const $loginForm = document.getElementById('login-or-code');
    const $phoneInput = document.querySelector('input[name="phone"]');
    const $submitBtn = $loginForm.querySelector('input[type="submit"]');

    let isCodeMode = false; // 标记：当前是否为验证码登录模式


    // ========== 2. 切换登录模式（密码 ↔ 验证码） ==========
    $toggleCode.addEventListener('click', (e) => {
        e.preventDefault();
        isCodeMode = !isCodeMode;

        // 更新输入框和按钮状态
        $input.name = isCodeMode ? 'code' : 'password';
        $input.placeholder = isCodeMode ? '请输入验证码' : '请输入你的密码';
        $toggleCode.textContent = isCodeMode ? '密码登录' : '验证码登录';
        $forgotLink.textContent = isCodeMode ? '发送验证码' : '忘记密码?';
        $loginForm.action = isCodeMode ? '/user/login/loginByCode' : '/user/login/login';

        // 恢复忘记密码链接状态（仅密码模式下恢复）
        if (!isCodeMode) {
            $forgotLink.classList.remove('disabled');
            $forgotLink.href = '/user/rooter/resetPasswordl';
        }
    });


    // ========== 3. 发送验证码逻辑（含倒计时优化） ==========
    $forgotLink.addEventListener('click', (e) => {
        if (!isCodeMode) return; // 仅验证码模式下触发
        e.preventDefault();

        const phone = $phoneInput.value.trim();
        if (!phone) {
            alert('请先输入手机号码！');
            return;
        }

        // 临时禁用按钮，避免重复点击
        $forgotLink.classList.add('disabled');
        $forgotLink.textContent = '发送中...';

        $.ajax({
            url: '/user/login/code',
            type: 'post',
            data: { phone },
            success: (res) => {
                $forgotLink.classList.remove('disabled'); // 先解锁，后续按需处理

                if (res.code === 200) {
                    alert(res.msg); // 提示成功
                    console.log("验证码为",res.data);
                    // 启动60秒倒计时
                    startCountdown($forgotLink);
                } else {
                    $forgotLink.textContent = '发送验证码'; // 恢复按钮文字
                    alert(res.msg || '验证码发送失败，请重试');
                }
            },
            error: () => {
                $forgotLink.classList.remove('disabled');
                $forgotLink.textContent = '发送验证码';
                alert(`验证码向${phone}发送失败`);
            }
        });
    });

    // 倒计时工具函数（解耦逻辑）
    function startCountdown(linkEl) {
        let count = 60;
        linkEl.classList.add('disabled');
        const timer = setInterval(() => {
            linkEl.textContent = `${count--}秒后重发`;
            if (count < 0) {
                clearInterval(timer);
                linkEl.textContent = '发送验证码';
                linkEl.classList.remove('disabled');
            }
        }, 1000);
    }


    // ========== 4. 异步提交登录表单（处理错误提示） ==========
    $loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止同步提交（避免页面刷新）

        // 显示加载状态
        $submitBtn.value = '登录中...';
        $submitBtn.disabled = true;

        // 序列化表单数据（含手机号、密码/验证码、记住我）
        const formData = new FormData($loginForm);

        $.ajax({
            url: $loginForm.action,
            type: 'post',
            data: formData,
            processData: false, // 必须：FormData 无需手动处理
            contentType: false, // 必须：让浏览器自动设置 Content-Type
            beforeSend:function (){
                console.log('即将发送的请求头：', this.headers); // 打印自己配置的请求头
            },
            success: (res) => {
                $submitBtn.value = '登录';
                $submitBtn.disabled = false;
                if (res.code === 200) {
                    console.log("token",res.data);
                    window.sessionStorage.setItem('token',res.data);
                    if(res.msg !== null) alert(res.msg);
                    window.location.href = '/user/rooter/index'; // 跳转至系统首页
                } else {
                    alert(res.msg || '登录失败，请重试');
                }
            },
            error: (xhr) => {
                $submitBtn.value = '登录';
                $submitBtn.disabled = false;

                try {
                    // 尝试解析后端返回的错误信息（即使HTTP状态码非200）
                    const res = JSON.parse(xhr.responseText);
                    alert(res.msg || '登录失败');
                } catch (e) {
                    alert('网络异常，请稍后重试');
                }
            }
        });
    });
});