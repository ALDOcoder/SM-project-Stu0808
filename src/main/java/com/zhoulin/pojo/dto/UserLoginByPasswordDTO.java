package com.zhoulin.pojo.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginByPasswordDTO {

    private String  phone; //手机号
    private String  password; //密码
}
