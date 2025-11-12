document.addEventListener('DOMContentLoaded', () => {
    // ===================== 1. 全局变量声明（统一管理DOM元素，避免重复查询）=====================
    const DOM = {
        avatarInput: document.getElementById('avatar-file'),
        avatarLabel: document.querySelector('.avatar-label'),
        profilePhoto: document.getElementById('profile-photo'), // 隐藏域：存储头像地址
        registerForm: document.getElementById('register-form'),
        submitBtn: document.querySelector('input[name="submit"]'),
        phoneInput: document.getElementById('phone'),
        sendCodeBtn: document.getElementById('toggle-code'),
        codeInput: document.getElementById('code')
    };

    // 全局状态：避免重复请求（如倒计时中禁止再次发送验证码）
    let isCounting = false;
    let isSubmitting = false;


    // ===================== 2. 通用工具函数（提取复用逻辑，减少重复代码）=====================
    /**
     * 手机号校验工具
     * @param {string} phone - 待校验的手机号
     * @returns {boolean} 校验结果（true=通过）
     */
    function validatePhone(phone) {
        const trimmedPhone = phone.trim();
        // 1. 校验空值
        if (!trimmedPhone) {
            alert('请输入手机号');
            return false;
        }
        // 2. 清除非数字字符（处理用户输入空格、横杠等情况）
        const cleanedPhone = trimmedPhone.replace(/\D/g, '');
        // 3. 校验长度和格式
        if (cleanedPhone.length !== 11 || !/^1[3-9]\d{9}$/.test(cleanedPhone)) {
            alert('请输入11位有效手机号码（如138xxxx8888）');
            return false;
        }
        return cleanedPhone; // 返回清洗后的手机号（后续直接用，避免重复处理）
    }

    /**
     * 倒计时工具（通用，支持任意按钮）
     * @param {HTMLElement} btn - 倒计时按钮
     * @param {number} count - 倒计时秒数（默认60）
     */
    function startCountdown(btn, count = 60) {
        if (isCounting) return; // 防止重复触发
        isCounting = true;
        const originalText = btn.textContent; // 保存按钮原始文本

        // 禁用按钮并设置初始文本
        btn.disabled = true;
        btn.classList.add('disabled');
        btn.textContent = `${count}秒后重发`;

        // 倒计时逻辑
        const timer = setInterval(() => {
            count--;
            btn.textContent = `${count}秒后重发`;
            if (count <= 0) {
                clearInterval(timer);
                // 恢复按钮状态
                btn.disabled = false;
                btn.classList.remove('disabled');
                btn.textContent = originalText;
                isCounting = false;
            }
        }, 1000);
    }

    /**
     * 通用AJAX错误处理（统一错误提示，避免重复代码）
     * @param {XMLHttpRequest} xhr - AJAX响应对象
     * @param {string} defaultMsg - 默认错误提示
     * @param {HTMLElement} btn - 需要恢复状态的按钮（可选）
     */
    function handleAjaxError(xhr, defaultMsg, btn) {
        // 尝试解析后端返回的错误信息
        let errorMsg = defaultMsg;
        try {
            const res = JSON.parse(xhr.responseText);
            errorMsg = res.msg || errorMsg;
        } catch (e) {
            errorMsg = '网络异常，请检查网络后重试';
        }
        alert(errorMsg);

        // 恢复按钮状态（如发送验证码、提交按钮）
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('disabled');
            if (btn === DOM.sendCodeBtn) btn.textContent = '发送验证码';
            if (btn === DOM.submitBtn) btn.value = '注册';
        }
    }

    /**
     * 注册表单提交前的基础校验（可扩展其他字段，如密码）
     * @returns {boolean} 校验结果
     */
    function validateRegisterForm() {
        const phone = validatePhone(DOM.phoneInput.value);
        const code = DOM.codeInput.value.trim();

        // 1. 先校验手机号
        if (!phone) return false;
        // 2. 校验验证码空值
        if (!code) {
            alert('请输入验证码');
            DOM.codeInput.focus(); // 聚焦到验证码输入框
            return false;
        }
        // 3. 可扩展：校验密码、确认密码等（根据实际表单字段添加）
        return { phone, code }; // 返回校验通过的参数
    }


    // ===================== 3. 核心业务逻辑 - 事件绑定 =====================
    /**
     * 事件1：发送验证码
     */
    DOM.sendCodeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isCounting) return; // 倒计时中，禁止重复点击

        // 1. 校验手机号
        const phone = validatePhone(DOM.phoneInput.value);
        if (!phone) return;

        // 2. 设置按钮加载状态
        DOM.sendCodeBtn.disabled = true;
        DOM.sendCodeBtn.classList.add('disabled');
        DOM.sendCodeBtn.textContent = '发送中...';

        // 3. 发送验证码AJAX请求
        $.ajax({
            url: '/user/login/code',
            type: 'post',
            data: { phone }, // 简写：phone: phone
            success: (res) => {
                if (res.code === 200) {
                    alert('验证码发送成功，请注意查收');
                    startCountdown(DOM.sendCodeBtn); // 启动倒计时
                } else {
                    alert(res.msg || '验证码发送失败，请重试');
                    // 恢复按钮状态
                    DOM.sendCodeBtn.disabled = false;
                    DOM.sendCodeBtn.classList.remove('disabled');
                    DOM.sendCodeBtn.textContent = '发送验证码';
                }
            },
            error: (xhr) => {
                handleAjaxError(xhr, '验证码发送失败', DOM.sendCodeBtn);
            }
        });
    });

    /**
     * 事件2：头像上传
     */
    DOM.avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            DOM.avatarLabel.textContent = '点击上传头像';
            return;
        }

        // 1. 校验文件类型（仅允许图片，可选优化）
        const allowTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowTypes.includes(file.type)) {
            alert('请上传JPG/PNG/GIF格式的图片');
            DOM.avatarInput.value = ''; // 清空选择
            return;
        }

        // 2. 显示已选文件名
        DOM.avatarLabel.textContent = `已选择：${file.name}`;

        // 3. 构建FormData（文件上传必须用FormData）
        const formData = new FormData();
        formData.append('avatar', file); // 键名需与后端@RequestParam("avatar")一致

        // 4. 上传头像AJAX请求
        $.ajax({
            url: '/user/profile/photo',
            type: 'post',
            data: formData,
            processData: false, // 禁止jQuery处理FormData（必加）
            contentType: false, // 禁止设置Content-Type（浏览器自动处理）
            success: (res) => {
                if (res.code === 200) {
                    alert('头像上传成功');
                    // 存储头像地址到隐藏域（供注册表单提交）
                    if (DOM.profilePhoto) DOM.profilePhoto.value = res.data;
                    console.log(res.data);
                } else {
                    alert(res.msg || '头像上传失败');
                    DOM.avatarLabel.textContent = '点击上传头像';
                }
            },
            error: (xhr) => {
                handleAjaxError(xhr, '头像上传失败');
                DOM.avatarLabel.textContent = '点击上传头像';
            }
        });
    });

    /**
     * 事件3：注册表单提交（先校验验证码，再提交表单）
     */
    DOM.submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isSubmitting) return; // 防止重复提交

        // 1. 基础表单校验（手机号、验证码）
        const formData = validateRegisterForm();
        if (!formData) return;

        // 2. 设置提交按钮加载状态
        isSubmitting = true;
        DOM.submitBtn.disabled = true;
        DOM.submitBtn.value = '注册中...';

        // 3. 第一步：校验验证码有效性
        $.ajax({
            url: '/user/login/registerByCode',
            type: 'post',
            data: { phone: formData.phone, code: formData.code },
            success: (res) => {
                if (res.code === 200) {
                    // 验证码通过，第二步：提交注册表单
                    console.log(res.data);
                    submitRegisterForm();
                } else {
                    alert(res.msg || '验证码错误或已过期');
                    // 恢复提交按钮状态
                    isSubmitting = false;
                    DOM.submitBtn.disabled = false;
                    DOM.submitBtn.value = '注册';
                }
            },
            error: (xhr) => {
                handleAjaxError(xhr, '验证码校验失败', DOM.submitBtn);
                isSubmitting = false;
            }
        });

        /**
         * 提交注册表单（内部函数：仅在验证码通过后调用）
         */
        function submitRegisterForm() {
            const registerFormData = new FormData(DOM.registerForm);

            $.ajax({
                url: '/user/login/register',
                type: 'post',
                data: registerFormData,
                processData: false,
                contentType: false,
                success: (res) => {
                    if (res.code === 200) {
                        alert('注册成功！即将跳转登录页');
                        window.location.href = '/user/login/'; // 跳转登录页
                    } else {
                        alert(res.msg || '注册失败，请重试');
                        // 恢复按钮状态
                        isSubmitting = false;
                        DOM.submitBtn.disabled = false;
                        DOM.submitBtn.value = '注册';
                    }
                },
                error: (xhr) => {
                    handleAjaxError(xhr, '注册失败', DOM.submitBtn);
                    isSubmitting = false;
                }
            });
        }
    });

 
});