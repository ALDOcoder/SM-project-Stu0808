package com.zhoulin.pojo.dto;


import lombok.Data;

@Data
public class AddressDTO {

    private Integer id;//id

    private String recipient; //收货人姓名


    private String phone; //联系电话(可以不是登录账号的电话号码)


    private String province;//省份


    private String city;// 城市


    private String district;// 区县


    private String detail;//详细地址


    private String zipCode;//邮政编码

    private Boolean isDefault;//是否默认地址(0:否,1:是)


    private String addressTag;//地址标签(如:家,公司,学校)






}
