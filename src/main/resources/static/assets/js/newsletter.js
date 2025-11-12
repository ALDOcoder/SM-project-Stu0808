/*
这段 JavaScript 代码的作用是 实
现两个新闻订阅表单（Newsletter Form）的无刷新提交功能，通过 AJAX 异步处理表单数据，并提供提交状态反馈（成功 / 失败消息）。
 */
$(document).ready(function() {

    function setupNewsletterForm(formId, msgId, submitId) {
      
      $(formId).on('submit', function (e) {
        var form = $(this);
        var msgElement = form.find(msgId);
        var submitBtn = form.find(submitId);
  
        // Clear previous message and update button text
        msgElement.html('').css('visibility', 'visible').show();
        submitBtn.html('Processing...').attr('disabled', true);
  
        // Submit form data using AJAX
        $.ajax({
          url: '../../assets/php/newsletter.php',
          type: 'post',
          data: form.serialize(),
          success: function (result) {
            msgElement.html(result).fadeIn(); // Display success message
  
            // Reset form fields
            form[0].reset();
  
            // Reset button text and enable button
            submitBtn.html('Subscribe').attr('disabled', false);
  
            // Clear success message after 5 seconds
            setTimeout(function () {
              msgElement.css('visibility', 'hidden');
            }, 4000); // 4 seconds delay
          },
          error: function () {
            msgElement.html('<span style="color: red;">Error occurred. Please try again later.</span>').fadeIn(); // Display error message if AJAX request fails
  
            // Reset button text and enable button
            submitBtn.html('Subscribe').attr('disabled', false);
          }
        });
  
        e.preventDefault(); // Prevent default form submission
      });
    }
  
    // Setup both newsletter forms
    setupNewsletterForm('#newsletter-form-1', '#msg-1', '#submit-1');
    setupNewsletterForm('#newsletter-form-2', '#msg-2', '#submit-2');
  });  