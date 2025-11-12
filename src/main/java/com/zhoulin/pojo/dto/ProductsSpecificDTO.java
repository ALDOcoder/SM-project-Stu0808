package com.zhoulin.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 或取特定的商品(最近的,最大优惠的,特色的)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductsSpecificDTO {

    private Integer isFeatured; // 是否特色商品
    private Integer isBestSeller; // 是否畅销商品
    private Integer isNew; // 是否新品
}
