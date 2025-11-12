package com.zhoulin.controller;


import com.zhoulin.pojo.dto.CartUpdateDTO;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.CartVO;
import com.zhoulin.service.IUserService;
import com.zhoulin.utils.UserHolder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author zhuoulin
 * @since 2025-08-18
 */
@RestController
@RequestMapping("/user")
@Slf4j
@Api(tags = "用户接口")
public class UserController {

    @Autowired
    private IUserService userService;


    /**
     * 用户订阅
     * @param phone
     * @return
     */
    @PostMapping("/subscript")
    @ApiOperation( "用户订阅")
    public Result subscript(@RequestParam("phone") String phone) {
        log.info("用户订阅,{}", UserHolder.getUser().getPhone());
        return userService.UserSubscript(phone);
    }


    /**
     * 用户添加购物车
     * @param productId
     * @return
     */
    @PostMapping("/cart/addCarted")
    @ApiOperation( "用户添加购物车")
    public Result addCarted(@RequestParam("productId") Integer productId) {
        log.info("用户添加购物车,{}", UserHolder.getUser().getPhone());
        return userService.addCarted(productId);

    }

    /**
     * 查询购物车
     * @return
     */
    @PostMapping("/cart/queryCarted")
    @ApiOperation( "查询购物车")
    public Result<List<CartVO>> queryCarted() {
        log.info("查询购物车,{}", UserHolder.getUser().getPhone());
        return userService.queryCarted();
    }

    /**
     * 删除购物车物品
     * @param productId
     * @return
     */
    @DeleteMapping("/cart/deleteByProductId")
    @ApiOperation( "删除购物车物品")
    public Result deleteByProductId(@RequestParam("productId") Integer productId) {
        log.info("删除购物车物品,{}", UserHolder.getUser().getPhone());
        return userService.deleteByProductId(productId);
    }

    /**
     * 更新购物车数量
     * @param
     * @return
     */
    @PutMapping("/cart/updateQuantity")
    @ApiOperation( "更新购物车数量")
    public Result updateQuantity(CartUpdateDTO cartUpdateDTO){
        log.info("{}更新购物车数量:{}",UserHolder.getUser().getPhone(),cartUpdateDTO);
        return userService.updateQuantity(cartUpdateDTO);
    }

}
