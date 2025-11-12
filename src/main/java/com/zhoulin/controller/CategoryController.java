package com.zhoulin.controller;


import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.CategoryVO;
import com.zhoulin.service.ICategoryService;
import com.zhoulin.utils.UserHolder;
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
 *  前端控制器
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-12
 */
@RestController
@RequestMapping("/user/category")
@Slf4j
@Api(tags = "分类接口")
public class CategoryController {

    @Autowired
    private ICategoryService categoryService;

    @GetMapping("/getAll")
    @ApiOperation(value = "获取所有分类")
    public Result<List<CategoryVO>> getCategoryAll(){
        log.info("获取所有分类:,{}", UserHolder.getUser());
        return categoryService.getCategoryAll();
    }
}
