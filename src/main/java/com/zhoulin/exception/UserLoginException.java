package com.zhoulin.exception;

/**
 * 员工登录异常
 */
public class UserLoginException extends BaseException{
    public UserLoginException() {
        super();
    }
    public UserLoginException(String msg) {
        super(msg);
    }
}
