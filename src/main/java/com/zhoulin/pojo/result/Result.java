package com.zhoulin.pojo.result;


import lombok.Data;

import java.io.Serializable;

@Data
public class Result<T> implements Serializable {

    private Integer code; //编码：200成功，400和其它数字为失败
    private String msg; //错误信息
    private Long total; //总记录数
    private T data; //数据

    public static <T> Result<T> success() {
        Result<T> result = new Result<T>();
        result.code = 200;
        return result;
    }

    public static <T> Result<T> success(String msg) {
        Result<T> result = new Result<T>();
        result.msg = msg;
        result.code = 200;
        return result;
    }

    public static <T> Result<T> success(T object,String msg,Long total) {
        Result<T> result = new Result<T>();
        result.data = object;
        result.code = 200;
        result.msg =msg;
        result.total = total;
        return result;
    }

    public static <T> Result<T> error(String msg) {
        Result result = new Result();
        result.msg = msg;
        result.code = 400;
        return result;
    }

    public static <T> Result<T> success(T object ,String msg) {
        Result<T> result = new Result<T>();
        result.data = object;
        result.code = 200;
        result.msg = msg;
        return result;
    }
    public static <T> Result<T> success(T object,Long total) {
        Result<T> result = new Result<T>();
        result.data = object;
        result.code = 200;
        result.total = total;
        return result;
    }

    public static <T> Result<T> success(T object) {
        Result<T> result = new Result<T>();
        result.data = object;
        result.code = 200;
        return result;
    }

    public static <T> Result<T> error(){
        Result<T> result = new Result<T>();
        result.code = 400;
        return result;
    }




}
