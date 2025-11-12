package com.zhoulin.interceptor;

import cn.hutool.core.util.StrUtil;
import com.zhoulin.constant.JwtClaimsConstant;
import com.zhoulin.pojo.entity.User;
import com.zhoulin.properties.JwtProperties;
import com.zhoulin.utils.JwtUtil;
import com.zhoulin.utils.UserHolder;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/**
 * jwt令牌校验的拦截器
 */
@Component
@Slf4j
public class JwtTokenInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtProperties jwtProperties;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)  {
        //判断拦截的请求是否为Contrloller方法
        /**
         * HandlerInterceptor拦截到的是不是拦截器的方法
         * HandlerMethod这个才是controller 方法
         */
        if(!(handler instanceof HandlerMethod)){
            //当前拦截到的不是动态方法，直接放行
            return true;
        }
        // 1. 从请求头中获取token
        String token = request.getHeader(jwtProperties.getTokenHeader());
        log.info(token);
        //2. 验证token
        if(StrUtil.isBlank( token)){
            log.info("请求头中不存在token,游客登录,不拦截");
            return true;
        }
       try{
           //3. 解析token
           Claims claims = JwtUtil.parseJWT(jwtProperties.getSecretKey(), token);
           //4. 获取当前登录用户phone
           String phone = (String) claims.get(JwtClaimsConstant.PHONE);
           Long userId = Long.valueOf(claims.get(JwtClaimsConstant.EMP_ID).toString());
           User user = User.builder().phone(phone)
                   .id(userId)
                   .build();
           UserHolder.setUser(user);
           // 3.1 解析token的有效时间
           long exp = claims.getExpiration().getTime();
           // 3.2 获取当前时间
           long now = System.currentTimeMillis();
           // 3.3 定义“即将过期的时间” 阈值
           long refreshTime = JwtClaimsConstant.REFRESH_TIME;
           if(exp - now < refreshTime){
               log.info(JwtClaimsConstant.TOKEN_TIME_OUT);
               // 3.4 获取当前登录用户
               String newToken = JwtUtil.createJWT(jwtProperties.getSecretKey(), jwtProperties.getTokenTtl(),  claims );
               // 将新 Token 放入响应头（客户端需监听此头并更新本地 Token）
               response.setHeader(jwtProperties.getNewTokenHeader(), newToken);
           }
           return true;
       } catch (Exception e){
           //5. 解析失败，拦截，返回401状态码
           response.setStatus(401);
           return false;
       }
   }
}
