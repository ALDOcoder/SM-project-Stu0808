package com.zhoulin.pojo.vo;

import lombok.Data;

/**
 * 购物车视图对象
 */
@Data
public class CartVO {

    private Long id;
    private String photo; // 商品图片
    private Integer productId; // 商品ID
    private String productName; // 商品名称
    private String categoryName; // 商品分类名称
    private Integer quantity; // 商品数量
    private Double price; // 商品单价

}
