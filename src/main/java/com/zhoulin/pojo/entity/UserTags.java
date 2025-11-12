package com.zhoulin.pojo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
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
 * @since 2025-09-15
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("user_tags")
@ApiModel(value="UserTags对象", description="")
@Builder
public class UserTags implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "用户行为表的主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "用户手机号")
    private String userPhone;

    @ApiModelProperty(value = "事件id")
    private Integer tagsId;

    @ApiModelProperty(value = "备注")
    private String described;

    @ApiModelProperty(value = "行为执行的时间")
    private LocalDateTime createdTime;


}
