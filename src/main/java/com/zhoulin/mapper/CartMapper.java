package com.zhoulin.mapper;

import com.zhoulin.pojo.entity.Cart;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhoulin.pojo.vo.CartVO;

import java.util.List;

/**
 * <p>
 * 购物车表 Mapper 接口
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-17
 */
public interface CartMapper extends BaseMapper<Cart> {

    /**
     * 查询购物车
     * @param userId
     * @return
     */
    List<CartVO> queryCarted(Long userId);
}
