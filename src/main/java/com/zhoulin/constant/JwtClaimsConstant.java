package com.zhoulin.constant;

public class JwtClaimsConstant {

    public static final String EMP_ID = "userId";
    public static final String PHONE = "phone";
    public static final String USERNAME = "username";
    public static final long REFRESH_TIME = 5 * 60 * 1000; // token 过期阈值5分钟

    public static final String TOKEN_TIME_OUT = "token 即将过期，重新生成token";
}
