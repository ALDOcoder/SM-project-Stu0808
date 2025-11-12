package com.zhoulin.controller;


import com.zhoulin.pojo.dto.ProductsSpecificDTO;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.ProductsVo;
import com.zhoulin.service.IProductsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 * 商品表，存储所有商品信息，使用逻辑外键关联分类 前端控制器
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-14
 */
@RestController
@RequestMapping("/user/products")
@Slf4j
@Api(tags = "商品接口")
public class ProductsController {

    @Autowired
    private IProductsService productsService;




    @GetMapping("/getSpecificProducts")
    @ApiOperation("获取指定的特殊商品,(最近的,最大优惠的,特色的)")
    //TODO 添加分页、排序
    public Result<List<ProductsVo>> getSpecificProducts(ProductsSpecificDTO productsSpecificDTO) {
        log.info("获取指定的特殊商品:,{}",productsSpecificDTO );
        return productsService.getSpecificProducts(productsSpecificDTO);
    }


}
