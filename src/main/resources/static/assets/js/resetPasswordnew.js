document.addEventListener('DOMContentLoaded',()=>{
    // ========== 1. 缓存所有DOM元素（避免重复查询） ==========
    const toggleCode =document.getElementById('toggle-code'); //发送验证码的node节点
    const submitBtn = document.querySelector('input[name="submit"]'); //校验验证码的node节点
    const phoneInput = document.querySelector('input[name="phone"]'); //电话号码的input
    const phoneError =document.getElementById('phone-error'); //电话号码错误的样式
    const resetForm = document.getElementById('reset-form'); //表单样式
    const flipCard = document.getElementById('flipCardInner');//翻转后的表单样式
    const passwordBtn =document.querySelector('input[name="passwordSubmit"]'); //翻转后的表单样式的修改密码按钮
    const passwordFrom =document.getElementById('password-form'); ////翻转后的表单样式

    let isCheckCode = false; // 标记：当前是否为验证码登录模式 false是 ，true代表可以去修改密码



    //校验手机号
    function validatePhone(phone) {
        //校验手机位空
        if(!phone){
            alert('手机号不能为空');
            return false;
        }

        //移除所有的非数字字符
        const cleanedPhone = phone.replace(/\D/g,'');

        //校验手机号长度
        if(cleanedPhone.length !== 11){
            alert('请输入11位有效手机号码');
            return false;
        }
        //校验通过
        return true;
    }

    //========== 1. 发送验证码逻辑（含倒计时优化） ==========
    toggleCode.addEventListener('click',(e)=>{
        if(isCheckCode) return;
        e.preventDefault();//阻止重复点击
        const phone = phoneInput.value.trim(); //赋值phoneInput的值

        // 验证手机号
       if(!validatePhone(phone)){
           return; // 验证失败，不发送验证码
       }

        //临时禁用按钮，避免重复点击
        toggleCode.classList.add('disabled');
        toggleCode.textContent = '发送中....';


        //异步处理
        $.ajax({
            url:'/user/login/code',
            type: 'post',
            data: {phone:phone},
            success: (res) =>{
                console.log("手机号位",phone);
                console.log("验证码为",res);
                //发送成功
                if(res.code === 200){
                    alert(res.msg);//提示成功
                    //启动60秒倒计时
                    startCountdown(toggleCode);
                }else {
                    toggleCode.textContent='发送验证码';
                    alert(res.msg || '验证码发送失败，请重试');
                }
            },
            error:()=>{
                toggleCode.classList.remove('disabled');
                toggleCode.textContent='发送验证码';
                alert(`验证码向${phone}发送失败`);
            }
        });


        //倒计时工具函数
        function startCountdown(linkEl){
            let count = 60;
            linkEl.classList.add('disabled');
            const timer = setInterval(()=>{
                linkEl.textContent = `${count--}秒后重发`;
                if (count < 0) {
                    clearInterval(timer);
                    linkEl.textContent = '发送验证码';
                    linkEl.classList.remove('disabled');
                }
            },1000);
        }
    });


    // ========== 2. 异步提交登录表单（处理错误提示） ==========
    resetForm.addEventListener('submit',(e)=>{
        e.preventDefault();// 阻止同步提交（避免页面刷新）

        // 显示加载状态
        submitBtn.value = '登录中...';
        submitBtn.disabled = true;

        // 序列化表单数据（含手机号、密码/验证码、记住我）
        const formData = new FormData(resetForm);

        $.ajax({
            url:resetForm.action,
            type: 'post',
            data: formData,
            processData: false, // 必须：FormData 无需手动处理
            contentType: false, // 必须：让浏览器自动设置 Content-Type
            success:(res)=>{
                submitBtn.value = '登录';
                submitBtn.disabled = false;

                console.log(formData);
                if(res.code === 200) {
                    console.log(resetForm.action);
                    //TODO
                    //账号存在,可以去修改密码了 如何去修改密码
                    flipCard.classList.add('active');
                }else {
                    alert(res.msg);
                }
            },
            error: (xhr) => {
                submitBtn.value = '登录';
                submitBtn.disabled = false;

                try {
                    // 尝试解析后端返回的错误信息（即使HTTP状态码非200）
                    const res = JSON.parse(xhr.responseText);
                    alert(res.msg || '校验失败');
                } catch (e) {
                    alert('网络异常，请稍后重试');
                }
            }
        });

    });

   //========== 3.密码修改 异步提交登录表单（处理错误提示） ==========
    passwordFrom.addEventListener('submit',(e)=>{
        e.preventDefault();// 阻止同步提交（避免页面刷新）
        // 显示加载状态
        passwordBtn.value = '提交中...';
        passwordBtn.disabled = true;
        //TODO 校验密码

        // 序列化表单数据（含手机号、密码/验证码、记住我）
        const phone = phoneInput.value.trim(); //赋值phoneInput的值
        const phoneHidden = passwordFrom.querySelector('input[name="phone"]');
        phoneHidden.value= phone;
        const password = new FormData(passwordFrom);
        //异步处理,提交新密码和电话号码
        $.ajax({
            url:passwordFrom.action,
            type:'put',
            data:password,
            processData: false, // 必须：FormData 无需手动处理
            contentType: false, // 必须：让浏览器自动设置 Content-Type
            success:(res)=>{
                passwordBtn.value = '提交';
                passwordBtn.disabled = true;
                console.log('要修改的手机号为：',phone);
                console.log('修改的密码为',password.values());
                if(res.code === 200){
                    alert('修改成功,已将返回登录页面');
                    window.location.href='/user/login/';
                }else {
                    alert(res.msg);
                }
            },
            error:(xhr)=>{
                passwordBtn.value = '提交';
                passwordBtn.disabled = true;
                try {
                    // 尝试解析后端返回的错误信息（即使HTTP状态码非200）
                    const res = JSON.parse(xhr.responseText);
                    alert(res.msg || '修改失败');
                } catch (e) {
                    alert('网络异常，请稍后重试');
                }
            }
        });

    });



});