package com.zhoulin.pojo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * <p>
 * 商品表，存储所有商品信息，使用逻辑外键关联分类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-14
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("products")
@ApiModel(value="Products对象", description="商品表，存储所有商品信息，使用逻辑外键关联分类")
public class Products implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "商品唯一标识符，自增主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "商品名称")
    @TableField("name")
    private String name;

    @ApiModelProperty(value = "商品详细描述")
    @TableField("description")
    private String description;

    @ApiModelProperty(value = "商品原价")
    @TableField("original_price")
    private BigDecimal originalPrice;

    @ApiModelProperty(value = "商品促销价，NULL表示无促销")
    @TableField("sale_price")
    private BigDecimal salePrice;

    @ApiModelProperty(value = "折扣百分比，NULL表示无折扣")
    @TableField("discount_percentage")
    private Integer discountPercentage;

    @ApiModelProperty(value = "逻辑外键：关联categories表的id，表示商品所属分类")
    @TableField("category_id")
    private Integer categoryId;

    @ApiModelProperty(value = "商品图片的存储路径")
    @TableField("photo")
    private String photo;

    @ApiModelProperty(value = "商品库存数量")
    @TableField("stock_quantity")
    private Double stockQuantity;

    @ApiModelProperty(value = "商品评分")
    @TableField("rating")
    private Double rating;

    @ApiModelProperty(value = "商品状态：1 可售，2-缺货，0 停售")
    @TableField("status")
    private Integer status;

    @ApiModelProperty(value = "是否特色商品：1-是，0-否")
    @TableField("is_featured")
    private Boolean isFeatured;

    @ApiModelProperty(value = "是否畅销商品：1-是，0-否")
    @TableField("is_best_seller")
    private Boolean isBestSeller;

    @ApiModelProperty(value = "是否新品：1-是，0-否")
    @TableField("is_new")
    private Boolean isNew;

    @ApiModelProperty(value = "商品被浏览次数")
    @TableField("view_count")
    private Integer viewCount;

    @ApiModelProperty(value = "商品创建时间")
    @TableField("created_time")
    private LocalDateTime createdTime;

    @ApiModelProperty(value = "商品最后更新时间")
    @TableField("updated_time")
    private LocalDateTime updatedTime;


}
