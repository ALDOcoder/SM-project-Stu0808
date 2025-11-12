package com.zhoulin.constant;

/**
 * 用户常量
 */
public class UserConstant {

    public static final String NEW_USER_PASSWORD="123456"; //自动注册的初始用户的密码

    public static final String NEW_USER_NAME="L绿色集市用户_";


    public static final String REGISTER_PASSWORD_DIFFERENT = "两次输入的密码不一致";

    public static final String USER_SUBSCRIPT_ERROR = "请输入自己的手机号";

    public static final String USER_SUBSCRIPT_EXIST = "用户已经订阅,不能重复订阅";
    // 用户订阅的标签id
    public static final Integer USER_SUBSCRIPT_TAGS_ID = 1;

    public static final String CART_UPDATE_ERROR = "cartUpdate数据不能为空";

    public static final Integer NAME_LENGTH=10;

    public static final Integer USER_ROLE_ID=2; //普通用户

    public static final Integer USER_STATUS_SUCCESS=1; //正常

    public static final Integer USER_STATUS_ERROR=0; //不正常常

    public static final String NEW_USER_REGISTER="恭喜您！完成新用户注册";

    public static final String UPDATE_PASSWORD_DIFFERENT = "前后输入的密码不一致";

    public static final String ADDRESS_DEFAULT_NOT_DELETE = "用户默认地址不能被删除";


    public static final String ADDRESS_NOT_EXIST = "修改的地址不存在";

    public static final String ORDER_CART_ERROR = "购物商品有变化,请稍后重试";
}
