package com.zhoulin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhoulin.pojo.dto.OrderDTO;
import com.zhoulin.pojo.dto.OrderPageQueryDTO;
import com.zhoulin.pojo.entity.Orders;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.OrderListVO;
import com.zhoulin.pojo.vo.PageResult;


/**
 * <p>
 * 订单表 服务类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-25
 */
public interface IOrderService extends IService<Orders> {
    /**
     * 创建订单
     * @param orderDTO
     * @return
     */
    Result payfor(OrderDTO orderDTO);


    /**
     * 获取订单列表全部订单
     *
     * @return
     */
    Result<PageResult<OrderListVO>> getALLlist(OrderPageQueryDTO orderPageQueryDTO);

    /**
     * 根据订单id查询，订单
     * @param  orderId
     * @return
     */
    Result getOrderAddressAndDeatilsById(Integer orderId);

    /**
     * 获取order items 列表
     * @param orderId
     * @return
     */
    Result getOrderItems(Integer orderId);
}
