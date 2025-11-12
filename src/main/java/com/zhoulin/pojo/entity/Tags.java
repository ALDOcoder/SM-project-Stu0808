package com.zhoulin.pojo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
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
 * 标签表，存储所有可用标签
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-15
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("tags")
@ApiModel(value="Tags对象", description="标签表，存储所有可用标签")
public class Tags implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "标签唯一标识符，自增主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "标签名称，如'特色商品'、'畅销商品'")
    private String name;

    @ApiModelProperty(value = "标签显示名称，如'特色'、'畅销'")
    private String displayName;

    @ApiModelProperty(value = "标签颜色代码，用于前端显示")
    private String colorCode;

    @ApiModelProperty(value = "标签是否激活：1-激活，0-禁用")
    private Boolean isActive;

    @ApiModelProperty(value = "标签创建时间")
    private LocalDateTime createdTime;


}
