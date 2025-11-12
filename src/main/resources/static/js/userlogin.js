document.addEventListener('DOMContentLoaded', function() {
    // 1. 集中管理DOM元素（根据实际HTML调整ID）
    const elements = {
        loginForm: document.getElementById('loginForm'),
        idInput: document.getElementById('id'),
        passwordInput: document.getElementById('password'),
        idError: document.getElementById('idError'),
        passwordError: document.getElementById('passwordError'),
        touristBtn: document.getElementById('tourist') // 游客按钮ID（对应界面“以游客身份登录”）

    };

    // 2. 状态管理工具函数（复用性优化）
    function setInvalid(input, errorEl, message) {
        input?.classList.add('invalid');
        input?.classList.remove('valid');
        errorEl.textContent = message;
    }
    function setValid(input, errorEl) {
        input?.classList.remove('invalid');
        input?.classList.add('valid');
        errorEl.textContent = '';
    }

    // 3. 账号/密码校验（仅作用于登录表单）
    function validateId() {
        const value = elements.idInput?.value.trim() || '';
        if (!value) {
            setInvalid(elements.idInput, elements.idError, '账号不能为空');
            return false;
        }
        setValid(elements.idInput, elements.idError);
        return true;
    }
    function validatePassword() {
        const value = elements.passwordInput?.value || '';
        if (!value) {
            setInvalid(elements.passwordInput, elements.passwordError, '密码不能为空');
            return false;
        }
        if (value.length < 6) {
            setInvalid(elements.passwordInput, elements.passwordError, '密码长度不能少于6位');
            return false;
        }
        setValid(elements.passwordInput, elements.passwordError);
        return true;
    }

    // MD5加密函数（需确保已引入CryptoJS库）
    function encryptPassword(plainPassword) {
        if (!window.CryptoJS) {
            console.error('请先引入CryptoJS库');
            return plainPassword;
        }
        const salt = 'sm_project_salt_2025'; // 实际项目建议从后端获取动态盐值
        return CryptoJS.MD5(plainPassword + salt).toString();
    }
    // 4. 表单提交处理（仅处理账号密码登录）
    function handleFormSubmit(event) {
        const isIdValid = validateId();
        const isPasswordValid = validatePassword();
        if (!isIdValid || !isPasswordValid) {
            event.preventDefault(); // 校验失败，阻止表单提交
            // 滚动到第一个错误
            const firstError = document.querySelector('.invalid');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError?.focus();
        }else {
            // （若需加密，可在此处添加密码加密逻辑）
            const { passwordInput } = elements;
            passwordInput.value = encryptPassword(passwordInput.value);
        }
    }

    // 5. 游客登录专属逻辑：直接跳转，跳过校验
    function redirectWithForm(url) {
        const form = document.createElement('form');
        form.action = url;
        form.method = 'GET'; // 或POST，根据需求调整
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
    function initTouristLogin() {
        const { touristBtn } = elements;
        if (touristBtn) {
            touristBtn.addEventListener('click', (event) => {
                event.preventDefault(); // 阻止默认行为（若按钮在form内）
                redirectWithForm('/employee/index.html'); // 直接跳转目标页
            });
        }
    }

    // 6. 事件绑定与初始化
    function bindEvents() {
        // 表单校验事件（账号/密码输入时）
        elements.idInput?.addEventListener('blur', validateId);
        elements.passwordInput?.addEventListener('blur', validatePassword);
        elements.idInput?.addEventListener('input', () => {
            if (elements.idInput.classList.contains('invalid')) validateId();
        });
        elements.passwordInput?.addEventListener('input', () => {
            if (elements.passwordInput.classList.contains('invalid')) validatePassword();
        });
        // 表单提交事件（仅处理账号密码登录）
        elements.loginForm?.addEventListener('submit', handleFormSubmit);
    }

    // 7. 页面初始化
    bindEvents();      // 绑定表单事件
    initTouristLogin();// 初始化游客登录
});


function redirectWithForm(url) {
    "use strict";
    const form = document.createElement('form');
    form.action = url;
    form.method = 'GET'; // 或POST，根据需求调整
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
function inlogin() {
    "use strict";
    redirectWithForm("/user/login/inlogin");
}

