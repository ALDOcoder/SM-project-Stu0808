package com.zhoulin.utils;

import com.zhoulin.pojo.entity.User;

/**
 * 登录用户信息 local thread
 */
// ThreadLocal是线程绑定的，登录请求的线程和后续接口请求的线程不是同一个线程。
// 每个请求都是由一个独立的线程处理的，所以在一个请求中存入ThreadLocal的数据，在另一个请求的线程中是无法获取的。
public class UserHolder {

    private static final ThreadLocal<User> LOCAL = new ThreadLocal<>();

    /**
     * 保存用户信息手机号
     * @param user
     */
    //TODO 去保存的用户的手机号
    public static void setUser(User user) {
        LOCAL.set(user);
    }

    /**
     * 获取用户信息
     * @return
     */
    public static User getUser() {
        return LOCAL.get();
    }

    /**
     * 删除用户信息
     */
    public static void remove() {
        LOCAL.remove();
    }
}
