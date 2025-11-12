package com.zhoulin.pojo.dto;


import lombok.Data;

import java.time.LocalDateTime;


/**
 * 分页查询参数
 */
@Data
public class  OrderPageQueryDTO {

    private Integer pageNO; //当前页码

    private Integer pageSize; //每页记录数

    private String  orderNo; //订单号

    private Long  userId; //用户id

    //@DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime  createdTime; //订单开始时间

    private Integer paymentStatus; //支付状态

}
