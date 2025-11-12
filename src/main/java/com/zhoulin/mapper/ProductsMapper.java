package com.zhoulin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhoulin.pojo.entity.Products;

/**
 * <p>
 * 商品表，存储所有商品信息，使用逻辑外键关联分类 Mapper 接口
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-14
 */

public interface ProductsMapper extends BaseMapper<Products> {

}
