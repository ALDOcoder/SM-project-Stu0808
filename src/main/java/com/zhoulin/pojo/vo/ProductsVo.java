package com.zhoulin.pojo.vo;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 商品VO类，用于返回给前端的VO类
 */
@Builder
@Data
public class ProductsVo {

    private Integer id;

    private String name;


    private String description;


    private BigDecimal originalPrice;


    private BigDecimal salePrice;


    private Integer discountPercentage;


    private Integer categoryId;


    private String photo;


    private Double stockQuantity;


    private Double rating;

    private Integer status;

    private Boolean isFeatured;


    private Boolean isBestSeller;


    private Boolean isNew;




}
