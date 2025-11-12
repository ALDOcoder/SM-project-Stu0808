package com.zhoulin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.github.pagehelper.Page;
import com.zhoulin.pojo.dto.OrderPageQueryDTO;
import com.zhoulin.pojo.entity.Orders;
import com.zhoulin.pojo.vo.OrderAddressAndDetailsVO;

/**
 * <p>
 * 订单表 Mapper 接口
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-25
 */
public interface OrdersMapper extends BaseMapper<Orders> {

    //获取所有订单
    Page<Orders> getAllList(OrderPageQueryDTO orderPageQueryDTO);

    OrderAddressAndDetailsVO getOrderAddressAndDeatilsById(Integer orderId);
}
