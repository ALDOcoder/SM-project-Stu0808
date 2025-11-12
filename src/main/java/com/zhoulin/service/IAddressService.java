package com.zhoulin.service;

import com.zhoulin.pojo.dto.AddressDTO;
import com.zhoulin.pojo.entity.Address;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zhoulin.pojo.result.Result;

/**
 * <p>
 * 用户地址表 服务类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-21
 */
public interface IAddressService extends IService<Address> {
    /**
     * 查询用户地址
     * @return
     */
    Result selectByUserId();

    /**
     * 添加用户地址
     * @param addressDTO
     * @return
     */
    Result saveP(AddressDTO addressDTO);


    /**
     * 用户更新地址
     * @param addressDTO
     * @return
     */
    Result updateAddresss(AddressDTO addressDTO);

    /**
     * 用户删除地址
     * @param id
     * @return
     */
    Result deleteAddressById(Integer id);

    /**
     * 用户获取指定的地址
     * @param id
     * @return
     */
    Result findById(Integer id);

    /**
     * 设置默认地址
     * @param id
     * @return
     */
    Result setDefaultAddress(Integer id);
}
