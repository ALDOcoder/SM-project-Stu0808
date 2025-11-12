package com.zhoulin.utils;


import cn.hutool.core.util.RandomUtil;
import com.zhoulin.constant.UserConstant;

/**
用户工具类
 */
public class UserUtils {

    public static String createdUserName(){
        return UserConstant.NEW_USER_NAME+ RandomUtil.randomString(UserConstant.NAME_LENGTH);
    }
}
