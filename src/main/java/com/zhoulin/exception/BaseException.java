package com.zhoulin.exception;

/**
 * 父类异常
 * “异常分层架构”，通过 BaseException 作为业务异常的统一基类，继承 RuntimeException
 * 一、统一异常体系：方便全局捕获
 * 二、代码复用：封装通用逻辑
 */
public class BaseException extends RuntimeException {


    public BaseException() {
    }

    public BaseException(String msg) {
        super(msg);
    }

}
