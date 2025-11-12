package com.zhoulin.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
//hutool工具类提供了更详细的PageResult分页结果类
public class PageResult<T> implements Serializable {

    private Long total; //总记录数

    private Integer pageTotal; //总页数

    private Integer page;// 当前页

    private List<T> list; //当前页数据
}
