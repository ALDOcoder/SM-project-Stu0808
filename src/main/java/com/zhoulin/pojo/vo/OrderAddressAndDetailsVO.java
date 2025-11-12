package com.zhoulin.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderAddressAndDetailsVO {

    private String orderNo;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private LocalDateTime createdTime;


    private Long address_id;
    private String recipient;
    private String phone;
    private String province;
    private String city;
    private String district;
    private String detail;
    private String zipCode;

}
