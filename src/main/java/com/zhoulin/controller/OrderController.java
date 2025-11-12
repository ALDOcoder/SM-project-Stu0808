package com.zhoulin.controller;


import com.zhoulin.pojo.vo.PageResult;
import com.zhoulin.pojo.dto.OrderDTO;
import com.zhoulin.pojo.dto.OrderPageQueryDTO;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.OrderListVO;
import com.zhoulin.service.IOrderService;
import com.zhoulin.utils.UserHolder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 订单表 前端控制器
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-25
 */
@RestController
@RequestMapping("/user/order")
@Api(tags="订单管理")
@Slf4j
public class OrderController {

    @Autowired
    private IOrderService orderService;

    /**
     * 用户结账生成订单
     * @param orderDTO
     * @return
     */
    @PostMapping("/payfor")
    @ApiOperation("用户结账生成订单")
    public Result payfor(OrderDTO orderDTO){
        log.info("用户结账生成订单", UserHolder.getUser().getPhone());
        return orderService.payfor(orderDTO);
    }

    /**
     * 获取用户订单列表 加入模糊查询并进行分页OrderPageQueryDTO
     * @param orderPageQueryDTO
     * @return
     */
    @PostMapping("/list")
    @ApiOperation("获取用户订单列表(模糊查询)")
    public Result<PageResult<OrderListVO>> list(OrderPageQueryDTO orderPageQueryDTO){
        log.info("获取用户订单列表:{}", UserHolder.getUser().getPhone());
        return orderService.getALLlist(orderPageQueryDTO);
    }

    /**
     * 根据订单id查询，订单
     * @param  orderId
     * @return
     */
    @GetMapping("/orderId")
    @ApiOperation("通过orderId获取用订单费用和地址")
    public Result findById(Integer orderId){
        log.info("通过orderId获取用订单:{}",orderId);
//        return Result.success(orderService.getById(orderId));
        return orderService.getOrderAddressAndDeatilsById(orderId);
    }

    /**
     * 获取order items 列表
     * @param orderId
     * @return
     */
    @GetMapping("/orderItems")
    @ApiOperation("获取order items 列表")
    public Result getOrderItems(Integer orderId){
        log.info("获取order items 列表:{}",orderId);
        return orderService.getOrderItems(orderId);
    }
}
