package com.zhoulin.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//强制为 .json 文件设置 Content-Type: application/json;
@Component
@Slf4j
public class JSONContentTypeInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri=request.getRequestURI();
        if(uri.endsWith(".json")){
            response.setContentType("application/json;charset=UTF-8");
        }
        return true;
    }
}
