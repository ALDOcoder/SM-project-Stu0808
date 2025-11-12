package com.zhoulin.pojo.dto;


import lombok.Data;

@Data
public class NewPasswordDTO {

    private String password;

    private String passwordAgain;

    private String phone;
}
