package com.zhoulin.pojo.dto;

import lombok.Data;

/**
 * 跟新购物车数量
 */
@Data
public class CartUpdateDTO {

    private Integer productId; //商品id

    private Integer quantity; //商品数量


}
