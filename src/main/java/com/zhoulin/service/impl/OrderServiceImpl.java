package com.zhoulin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.UUID;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.zhoulin.constant.UserConstant;
import com.zhoulin.exception.OrderException;
import com.zhoulin.mapper.CartMapper;
import com.zhoulin.mapper.OrderDetailMapper;
import com.zhoulin.mapper.OrdersMapper;
import com.zhoulin.pojo.dto.OrderDTO;
import com.zhoulin.pojo.dto.OrderPageQueryDTO;
import com.zhoulin.pojo.entity.Cart;
import com.zhoulin.pojo.entity.OrderDetail;
import com.zhoulin.pojo.entity.Orders;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.CartVO;
import com.zhoulin.pojo.vo.OrderAddressAndDetailsVO;
import com.zhoulin.pojo.vo.OrderListVO;
import com.zhoulin.pojo.vo.PageResult;
import com.zhoulin.service.IOrderService;
import com.zhoulin.utils.UserHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 订单表 服务实现类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-25
 */
@Service
public class OrderServiceImpl extends ServiceImpl<OrdersMapper, Orders> implements IOrderService {

    @Autowired
    private OrderDetailMapper orderDetailMapper;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private OrdersMapper ordersMapper;

    /**
     * 订单支付
     * @param orderDTO
     * @return
     */
    @Override
    @Transactional
    public Result payfor(OrderDTO orderDTO) {
        //获取用户的id   支付状态（1.已付 2.待付 3. 取消付款）  支付方式(1.支付宝 2. 微信 3.银行转账 4. 货到付款)
        Long userId = UserHolder.getUser().getId();
        Orders order = BeanUtil.copyProperties(orderDTO, Orders.class);
        //生成UUID作为订单编号
        UUID uuid = UUID.randomUUID();
        order.setOrderNo(uuid.toString());
        order.setUserId(userId);
        order.setCreatedTime(LocalDateTime.now());
        order.setUpdatedTime(LocalDateTime.now());
        order.setPaidTime(LocalDateTime.now());
        //模拟订单支付成功
        order.setPaymentStatus(1); //需要主键回显
        baseMapper.insert(order);
        //生成订单详细表
        // 1. 查询cart里的信息
        List<CartVO> cartVOS = cartMapper.queryCarted(userId);
        // 2. 获取总价
        double sum = cartVOS.stream().mapToDouble(cartVO -> cartVO.getPrice().doubleValue() * cartVO.getQuantity()).sum();
        if(sum != order.getSubtotal().doubleValue() ){
            //订单金额与购物车金额不一致 说明购物车金额有误数据有变化不能创建订单
            throw new OrderException(UserConstant.ORDER_CART_ERROR);
        }
        // 3.数据一致 创建订单详细表
        cartVOS.forEach(cartVO -> {
            OrderDetail build = OrderDetail.builder()
                    .orderId(order.getId())
                    .productId(cartVO.getProductId())
                    .name(cartVO.getProductName())
                    .price(cartVO.getPrice())
                    .quantity(cartVO.getQuantity())
                    .subtotal(cartVO.getPrice() * cartVO.getQuantity())
                    .photo(cartVO.getPhoto())
                    .createdTime(LocalDateTime.now())
                    .build();
            orderDetailMapper.insert(build);
        });
        //4.删除购物车
        cartMapper.delete(new LambdaUpdateWrapper<Cart>().eq(Cart::getUserId,userId));
        //5.返回结果
        return Result.success(order.getOrderNo());
    }


    /**
     * 获取订单列表 加入了模糊查询并进行分页
     *
     * @return
     */
    @Override
    public Result<PageResult<OrderListVO>> getALLlist(OrderPageQueryDTO orderPageQueryDTO) {
        //获取所以的订单
//        List<Orders> order = Db.list(Orders.class);
        //获取分页数据
        if(orderPageQueryDTO.getPageNO() == null|| orderPageQueryDTO.getPageSize() == null) return Result.error();
        PageHelper.startPage(orderPageQueryDTO.getPageNO(),orderPageQueryDTO.getPageSize());
        //手写sql 进行分页查询
        Page<Orders> page =ordersMapper.getAllList(orderPageQueryDTO);
        PageResult<OrderListVO> pageResult = new PageResult<>();
        //类型转换orders->OrderListVO
        List<OrderListVO> list = page.getResult().stream().map(orders -> {
            return BeanUtil.copyProperties(orders, OrderListVO.class);
        }).collect(Collectors.toList());
        pageResult.setPageTotal(page.getPages());
        pageResult.setTotal(page.getTotal());
        pageResult.setPage(page.getPageNum());
        pageResult.setList(list);
        return Result.success(pageResult);
    }


    /**
     * 根据订单id查询，订单
     * @param  orderId
     * @return
     */
    @Override
    public Result getOrderAddressAndDeatilsById(Integer orderId) {
        //获取订单信息
        OrderAddressAndDetailsVO orderAddressAndDetailsVO=ordersMapper.getOrderAddressAndDeatilsById(orderId);
        if(orderAddressAndDetailsVO == null) return Result.error();
        return Result.success(orderAddressAndDetailsVO);
    }

    @Override
    public Result getOrderItems(Integer orderId) {
        //获取订单信息
        List<OrderDetail> orderDetail = orderDetailMapper.selectList(new LambdaQueryWrapper<OrderDetail>()
                .eq(OrderDetail::getOrderId, orderId));
        return orderDetail.size() == 0 ? Result.error() : Result.success(orderDetail);
    }


}
