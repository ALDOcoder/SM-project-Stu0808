package com.zhoulin.pojo.dto;


import lombok.Data;

@Data
public class UserDTO {

    public String username;

    private String phone;

    private String password;

    private String passwordAgain;

    private String sex;

    private String profile;
}
