package com.zhoulin.pojo.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginByCodeDTO {

    private String phone; //手机号
    private Integer code; //验证码
}
