package com.zhoulin.controller;


import com.zhoulin.pojo.dto.AddressDTO;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.service.IAddressService;
import com.zhoulin.utils.UserHolder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 用户地址表 前端控制器
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-21
 */
@RestController
@RequestMapping("/user/address")
@Api(tags = "用户地址接口管理")
@Slf4j
public class AddressController {

    @Autowired
    public IAddressService addressService;


    /**
     * 查询用户地址接口
     * @return
     */
    @GetMapping("/queryAddress")
    @ApiOperation("查询用户地址接口")
    public Result query() {
        log.info("查询用户地址,{}", UserHolder.getUser().getPhone());
        return addressService.selectByUserId();
    }

    /**
     * 添加用户地址接口
     * @param addressDTO
     * @return
     */
    @PostMapping("/addAddress")
    @ApiOperation("添加用户地址接口")
    public Result add( AddressDTO addressDTO) {
        log.info("添加用户地址,{}", UserHolder.getUser().getPhone());
        return addressService.saveP(addressDTO);
    }

    /**
     * 用户更新地址
     * @param addressDTO
     * @return
     */
    @PutMapping("/updateAddress")
    @ApiOperation("用户更新地址")
    public Result update( AddressDTO addressDTO){
        log.info("用户更新地址,{}",UserHolder.getUser().getPhone());
        return addressService.updateAddresss(addressDTO);
    }

    /**
     * 用户删除地址
     * @param id
     * @return
     */
    @DeleteMapping("/deleteAddress")
    @ApiOperation("用户删除地址")
    public Result deleteById(Integer id){
        log.info("用户删除地址,{}地址ID:,{}",UserHolder.getUser().getPhone(),id);
        return addressService.deleteAddressById(id);
    }
    /**
     * 用户获取指定的地址数据
     * @param id
     * @return
     */
    @GetMapping("/selectAddressOne")
    @ApiOperation("用户获取指定的地址数据")
    public Result findById(Integer id){
        log.info("用户:{}获取指定的地址数据:{}",UserHolder.getUser().getPhone(),id);
        return addressService.findById(id);
    }


    /**
     * 用户设置默认地址(cartList按钮设置)
     * @param id
     * @return
     */
    @PutMapping("/setDefaultAddress")
    @ApiOperation("用户设置默认地址(cartList按钮设置)")
    public Result setDefaultAddress(Integer id){
        log.info("用户:{}设置默认地址:{}",UserHolder.getUser().getPhone(),id);
        return addressService.setDefaultAddress(id);
    }


}
