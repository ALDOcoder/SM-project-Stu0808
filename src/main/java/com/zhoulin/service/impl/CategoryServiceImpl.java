package com.zhoulin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhoulin.constant.CategoryConstant;
import com.zhoulin.exception.CategoryExcetion;
import com.zhoulin.mapper.CategoryMapper;
import com.zhoulin.pojo.entity.Category;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.CategoryVO;
import com.zhoulin.service.ICategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-12
 */
@Service
@Slf4j
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements ICategoryService {

    /**
     * 获取所有分类
     *
     * @return
     */
    @Override
    public Result<List<CategoryVO>> getCategoryAll() {
        List<Category> list = this.list();
        if(list.size() == 0|| list == null){
            throw new CategoryExcetion(CategoryConstant.CATEGORY_ALL_ERROR);
        }
        List<CategoryVO> categoryVOS = BeanUtil.copyToList(list, CategoryVO.class);
        return Result.success(categoryVOS,Long.valueOf(categoryVOS.size()));
    }
}
