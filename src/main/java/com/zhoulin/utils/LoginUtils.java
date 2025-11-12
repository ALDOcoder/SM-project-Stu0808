package com.zhoulin.utils;


import com.zhoulin.constant.LoginConstant;
import com.zhoulin.exception.UserLoginException;
import org.springframework.util.DigestUtils;

/**
 * 登录工具 账号校验类
 */
public class LoginUtils {


    // 校验用户账号
    public static void checkLoginPhone(Object id){

        if(id==null||!id.getClass().equals(String.class)){
            throw new UserLoginException(LoginConstant.LOGIN_USER_ID_TYPE);
        }
        if(id.toString().length()!=11){
            throw new UserLoginException(LoginConstant.LOGIN_USER_ID_LIMIT);
        }
    }

    // 校验用户密码并使用MD5加密
    public static String checkLoginPassword(Object password){
        if(password==null||!password.getClass().equals(String.class)){
            throw new UserLoginException(LoginConstant.LOGIN_USER_PASSWORD_LIMIT);
        }
        if(password.toString().length()>16){
            throw new UserLoginException(LoginConstant.LOGIN_USER_PASSWORD_LENGTH_ERROR);
        }

        String md5 = DigestUtils.md5DigestAsHex(password.toString().getBytes());
        return md5;

    }
    // 校验code 验证码
    public static void checkLoginCode(Object code){
        if(code==null||!code.getClass().equals(Integer.class)){
            throw new UserLoginException(LoginConstant.LOGIN_USER_CODE_TYPE_ERROR);
        }
        if(code.toString().length()!=6){
            throw new UserLoginException(LoginConstant.LOGIN_USER_CODE_LENGTH_ERROR);
        }
    }


}
