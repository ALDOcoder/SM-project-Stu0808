package com.zhoulin.pojo.vo;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Data
public class OrderListVO {

    private  Long id;

    private  String orderNo;

    private  Long userId;

    private LocalDateTime createdTime;

    private  Integer paymentStatus;

    private BigDecimal totalAmount;

}
