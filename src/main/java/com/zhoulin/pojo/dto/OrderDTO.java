package com.zhoulin.pojo.dto;


import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 订单数据传输对象DTO
 */
@Data
public class OrderDTO {

    private Integer addressId;


    private Integer paymentMethod;


    private Integer paymentStatus;


    private BigDecimal subtotal;


    private BigDecimal shippingFee;


    private BigDecimal discount;


    private BigDecimal totalAmount;

    @ApiModelProperty(value = "TODO 优惠劵id")
    private String discountCouponId;

    @ApiModelProperty(value = "TODO 优惠劵折扣金额")
    private BigDecimal discountCoupon;
}
