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
import java.time.LocalDateTime;

/**
 * <p>
 * 
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-12
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("category")
@ApiModel(value="Category对象", description="")
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "物品种类的主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "物品种类的名称")
    private String name;

    @ApiModelProperty(value = "物品种类的图片")
    private String photo;

    @ApiModelProperty(value = "分类显示顺序，数值越小越靠前")
    @TableField("display_order")
    private Integer displayOrder;


    @ApiModelProperty(value = "分类是否激活：1-激活，0-禁用")
    @TableField("is_active")
    private Integer isActive;

    @ApiModelProperty(value = "物品种类被创造的时间")
    private LocalDateTime createdTime;

    @ApiModelProperty(value = "物品种类被更新的时间")
    private LocalDateTime updatedTime;

}
