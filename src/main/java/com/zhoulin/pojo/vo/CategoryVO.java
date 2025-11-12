package com.zhoulin.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Description:
 * @Author: zhoulin
 * @CreateDate: 2020/12/5 0005 16:05
 * @Version: 1.0
 *
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryVO {

    private String name;

    private String photo;
}
