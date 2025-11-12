$(document).ready(function(){
    // 手机号校验函数
    function checkPhone(phone) {
        var reg = /^1[3456789]\d{9}$/;
        return reg.test(phone);
    }

    // 显示消息函数
    function showMessage(element, message, isError = false) {
        element.text(message);
        element.removeClass('error');
        if (isError) {
            element.addClass('error');
        }
        element.fadeIn();

        // 3秒后自动隐藏消息
        setTimeout(function() {
            element.fadeOut();
        }, 3000);
    }

    // 设置新闻通讯表单
    function setupNewsletterForm(formId, msgId, submitId) {
        $(formId).on('submit', function(e) {
            e.preventDefault();

            var form = $(this);
            var msgElement = $(msgId);
            var submitBtn = $(submitId);
            var btnText = submitBtn.find('.btn-text');

            // 清除前一个消息
            msgElement.hide();

            // 获取手机号输入值
            var phoneInput = form.find('input[name="phone"]').val().trim();

            // 验证手机号
            if (!checkPhone(phoneInput)) {
                showMessage(msgElement, '请输入正确的手机号码', true);
                return false;
            }

            // 更新按钮状态
            submitBtn.attr('disabled', true);
            btnText.text('处理中...');

            // 使用AJAX提交表单数据
            $.ajax({
                url: '/user/subscript',
                type: 'post',
                data: form.serialize(),
                success: function(res) {
                    if (res.code === 200) {
                        showMessage(msgElement, '订阅成功！');
                        form[0].reset();
                    } else {
                        showMessage(msgElement, res.msg||'订阅失败，请稍后重试', true);
                    }
                },
                error: function(xhr, status, error) {
                    console.log("订阅请求错误:", error);
                    showMessage(msgElement, '网络错误，请稍后重试', true);
                },
                complete: function() {
                    // 恢复按钮状态
                    submitBtn.attr('disabled', false);
                    btnText.text('订阅');
                }
            });
        });
    }

    // 调用函数
    setupNewsletterForm('#newsletter-form-1', '#msg-1', '#submit-1');
});