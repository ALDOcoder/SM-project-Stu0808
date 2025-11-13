package com.zhoulin.config;

import com.zhoulin.interceptor.JSONContentTypeInterceptor;
import com.zhoulin.interceptor.JwtTokenInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;


@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {


    @Autowired
    private JwtTokenInterceptor jwtTokenInterceptor;

    @Autowired
    private JSONContentTypeInterceptor jsonContentTypeInterceptor;

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 设置根路径默认跳转到登录页面
        registry.addViewController("/").setViewName("redirect:/user/login");
    }

    // 添加拦截器
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        log.info("开始注册自定义拦截器...");
        //JSON 文件 Content-Type 拦截器（解决前端解析问题）
        registry.addInterceptor(jsonContentTypeInterceptor)
                .addPathPatterns("/**");
        registry.addInterceptor(jwtTokenInterceptor)
                .addPathPatterns("/user/rooter/Cart","/user/subscript","/user/cart/addCarted","/user/cart/queryCarted",
                        "/user/cart/deleteByProductId","/user/cart/updateQuantity",
                        "/user/rooter/checkout","/user/address/**"
                         ,"/user/order/**","/user/rooter/order List");
    }

    @Bean
    public Docket docket(){
        log.info("开始创建docket");
        ApiInfo apiInfo =new ApiInfoBuilder()
                .title("超市销售项目管理")
                .version("1.0.0")
                .license("ZHouLIN")
                .description("超市销售项目接口文档")
                .build();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .groupName("SMP")
                .apiInfo(apiInfo)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.zhoulin.controller"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }


    /**
     * 设置静态资源映射
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("开始设置静态资源映射.....");
        registry.addResourceHandler("/doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");

        log.info("开始加前端的静态资源》》》》》");
        // 2. 添加项目静态资源映射（关键！）
        registry.addResourceHandler("/**")  // 匹配所有请求路径
                .addResourceLocations("classpath:/static/");  // 指向 static 目录

    }

}
