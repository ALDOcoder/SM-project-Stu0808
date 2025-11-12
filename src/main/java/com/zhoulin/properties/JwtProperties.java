package com.zhoulin.properties;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "zhoulin.jwt")
public class JwtProperties {


    /**
     * 用户生成jwt令牌相关配置
     */
    private String TokenHeader;
    private long TokenTtl;
    private String SecretKey;
    private String NewTokenHeader;
}
