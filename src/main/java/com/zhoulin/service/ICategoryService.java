package com.zhoulin.service;

import com.zhoulin.pojo.entity.Category;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.CategoryVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-12
 */
public interface ICategoryService extends IService<Category> {
    /**
     * 获取所有分类
     *
     * @return
     */
    Result<List<CategoryVO>> getCategoryAll();
}
