package com.zhoulin.utils;

import cn.hutool.core.util.RandomUtil;


/**
 * 验证码工具类
 */
public class CodeUtils {
    public static final Integer LOGIN_CODE=6;

    public static Integer sendLoginCode(){
        String code = RandomUtil.randomNumbers(LOGIN_CODE);
        return Integer.valueOf(code);
    }
}
