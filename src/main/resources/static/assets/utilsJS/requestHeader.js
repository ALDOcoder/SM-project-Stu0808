// // 确保在 jQuery 加载后执行
// $(function() { // 等价于 $(document).ready()，确保 DOM 和 jQuery 都加载完成
//     $.ajaxSetup({
//         headers: {
//             'Authorization': sessionStorage.getItem('token') || '' // 避免 null 导致错误
//         },
//         beforeSend: function(xhr) {
//             const latestToken = sessionStorage.getItem('token');
//             if (latestToken) {
//                 xhr.setRequestHeader('Authorization', latestToken);
//             }
//         }
//     });
// });
// 1. 配置常量
const TOKEN_KEY = 'Authorization';
const TOKEN_LOCAL_KEY = 'token';
const TOKEN_HEADER = 'X-Auth-Token';

// 2. 工具函数：获取/设置/删除本地 Token
const TokenUtil = {
    getToken() {
        return sessionStorage.getItem(TOKEN_LOCAL_KEY)|| "";
    },
    setToken(token) {
        if( token){
            sessionStorage.setItem(TOKEN_LOCAL_KEY, token);
            console.log("Token 已经更新", token);

        }
    },
    removeToken() {
        sessionStorage.removeItem(TOKEN_LOCAL_KEY);
        console.log("Token 已清除");
    }
};

$(function (){

    // 3. 配置 jQuery Ajax 全局配置请求头
    $.ajaxSetup({
        beforeSend: function(xhr) {
            const latestToken = TokenUtil.getToken();
            if (latestToken) {
                xhr.setRequestHeader(TOKEN_KEY, latestToken);
            }
        },
        // dataType: "json",
        // contentType: "application/json;charset=utf-8"
    });

    // 4. 全局监听：所有 AJAX 响应完成后，检查并接收新 Token（响应后触发）
    $(document).on('ajaxComplete', function(event, xhr, settings) {
        // 关键：从响应头中获取新 Token（后端通过 TOKEN_HEADER 头返回）
        const newToken = xhr.getResponseHeader(TOKEN_HEADER);

        // 若响应头中有新 Token，则更新本地存储
        if (newToken) {
            TokenUtil.setToken(newToken);
        }
    });

    // 5. 全局监听：所有 AJAX 错误统一处理（如 401 Token 过期）
    $(document).on("ajaxError", function(event, xhr, settings, error) {
        // 捕获 401 未授权错误（Token 已过期且未刷新成功）
        if (xhr.status === 401) {
            TokenUtil.removeToken(); // 清除无效 Token
            alert("登录已过期，请重新登录");
            window.location.href = "/user/login"; // 跳转到登录页
        }
    });
 });
