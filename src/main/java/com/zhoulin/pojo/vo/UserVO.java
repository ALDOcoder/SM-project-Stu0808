package com.zhoulin.pojo.vo;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVO implements Serializable {

    private Long id;

    private String username;

    private String sex;

    private String phone;

    private String idNumber;

    private Integer status;

    private Integer roleId;
}
