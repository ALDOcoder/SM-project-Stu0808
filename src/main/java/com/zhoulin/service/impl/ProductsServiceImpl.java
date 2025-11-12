package com.zhoulin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhoulin.constant.CategoryConstant;
import com.zhoulin.exception.CategoryExcetion;
import com.zhoulin.mapper.ProductsMapper;
import com.zhoulin.pojo.dto.ProductsSpecificDTO;
import com.zhoulin.pojo.entity.Products;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.ProductsVo;
import com.zhoulin.service.IProductsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 商品表，存储所有商品信息，使用逻辑外键关联分类 服务实现类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-14
 */
@Service
@Slf4j
public class ProductsServiceImpl extends ServiceImpl<ProductsMapper, Products> implements IProductsService {


    /**
     * 获取指定的特殊商品,(最近的,最大优惠的,特色的)
     * @param productsSpecificDTO
     * @return
     */
    @Override
    public Result<List<ProductsVo>> getSpecificProducts(ProductsSpecificDTO productsSpecificDTO) {
        LambdaQueryWrapper<Products> queryWrapper = new LambdaQueryWrapper<>();
        // 是否特色
        if(productsSpecificDTO.getIsFeatured() != null){
            queryWrapper.eq(Products::getIsFeatured,productsSpecificDTO.getIsFeatured());
        }
        // 是否畅销
        if(productsSpecificDTO.getIsBestSeller() != null){
            queryWrapper.eq(Products::getIsBestSeller,productsSpecificDTO.getIsBestSeller());
        }
        // 是否新品
        if(productsSpecificDTO.getIsNew() != null){
            queryWrapper.eq(Products::getIsNew,productsSpecificDTO.getIsNew());
        }
        // 产品的存货必须大于0
        queryWrapper.gt(Products::getStockQuantity,CategoryConstant.PRODUCT_QUANTITY_COMPLETE);
        // 产品的状态必须为可售
        queryWrapper.eq(Products::getStatus,CategoryConstant.PRODUCT_STATUS_SELLING);

        List<Products> list = list(queryWrapper);
        List<ProductsVo> productsVos = BeanUtil.copyToList(list, ProductsVo.class);
        //判断集合是否为空
        if(list.size() == 0|| list == null){
            throw new CategoryExcetion(CategoryConstant.PRODUCT_QUANTITY_ERROR);
        }
        return Result.success(productsVos,Long.valueOf(productsVos.size()));
    }
}
