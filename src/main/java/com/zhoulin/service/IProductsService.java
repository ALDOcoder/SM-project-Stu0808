package com.zhoulin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhoulin.pojo.dto.ProductsSpecificDTO;
import com.zhoulin.pojo.entity.Products;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.ProductsVo;

import java.util.List;

/**
 * <p>
 * 商品表，存储所有商品信息，使用逻辑外键关联分类 服务类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-14
 */
public interface IProductsService extends IService<Products> {
    /**
     * 获取指定的特殊商品,(最近的,最大优惠的,特色的)
     * @param productsSpecificDTO
     * @return
     */
    Result<List<ProductsVo>>  getSpecificProducts(ProductsSpecificDTO productsSpecificDTO);
}
