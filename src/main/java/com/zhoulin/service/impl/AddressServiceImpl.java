package com.zhoulin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhoulin.constant.UserConstant;
import com.zhoulin.mapper.AddressMapper;
import com.zhoulin.pojo.dto.AddressDTO;
import com.zhoulin.pojo.entity.Address;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.service.IAddressService;
import com.zhoulin.utils.UserHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * <p>
 * 用户地址表 服务实现类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-09-21
 */
@Service
public class AddressServiceImpl extends ServiceImpl<AddressMapper, Address> implements IAddressService {

    @Autowired
    private AddressMapper addressMapper;

    /**
     * 根据用户ID查询用户地址
     * @return
     */
    @Override
    public Result selectByUserId() {
        Long userId = UserHolder.getUser().getId();
        return Result.success(baseMapper.selectList(new LambdaUpdateWrapper<Address>().eq(Address::getUserId, userId)));
    }

    /**
     * 保存用户地址
     * @param addressDTO
     * @return
     */
    @Override
    @Transactional
    public Result saveP(AddressDTO addressDTO) {
        //获取用户ID
        Long userId = UserHolder.getUser().getId();
        //常看是否默认
        if (addressDTO.getIsDefault()) {
            //设置为默认 修改其他为非否认
            baseMapper.update(new Address().setIsDefault(false).setUpdatedAt(LocalDateTime.now()),
                    new LambdaUpdateWrapper<Address>().eq(Address::getIsDefault, true));
        }
        //保存地址
        Address address = BeanUtil.copyProperties(addressDTO, Address.class);
        address.setUserId(userId);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());
        address.setStatus(true);
        int insert = baseMapper.insert(address);
        return insert > 0 ? Result.success() : Result.error();
    }


    /**
     * 用户更新地址
     * @param addressDTO
     * @return
     */
    @Override
    @Transactional
    public Result updateAddresss(AddressDTO addressDTO) {
        //获取用户的id
        Long userId = UserHolder.getUser().getId();
        //获取地址id
        Integer id = addressDTO.getId();
        //判断是否存在该地址
        if(baseMapper.selectCount(new LambdaQueryWrapper<Address>()
                .eq(Address::getId,id))==0) return Result.error(UserConstant.ADDRESS_NOT_EXIST);
        //判断是否设置了默认地址  //首先，有 问题 1.更新数据没有时，要不要去覆盖旧的数据，我认为在前端去校验数据，不让他传空的数据给我
        if(addressDTO.getIsDefault()){
            //设置该地址为默认地址 修改默认地址
            baseMapper.update(new Address().setIsDefault(false),new LambdaUpdateWrapper<Address>()
                    .eq(Address::getIsDefault,true));
        }
        //不是默认地址
        //直接去更新地址
        Address address = BeanUtil.copyProperties(addressDTO, Address.class);
        address.setUpdatedAt(LocalDateTime.now());
        return baseMapper.updateById(address) > 0? Result.success():Result.error();
    }

    /**
     * 用户删除地址
     * @param id
     * @return
     */
    @Override
    public Result deleteAddressById(Integer id) {
        //获取用户的id
        Long userId = UserHolder.getUser().getId();
        //查询删除的是不是默认地址
        Address address = baseMapper.selectById(id);
        if(address.getIsDefault()){
            return Result.error(UserConstant.ADDRESS_DEFAULT_NOT_DELETE);
        }
        return baseMapper.delete(new LambdaUpdateWrapper<Address>().eq(Address::getId,id)
                .eq(Address::getUserId,userId)) > 0?Result.success():Result.error();
    }

    /**
     * 用户获取指定地址信息
     * @param id
     * @return
     */
    @Override
    public Result findById(Integer id) {
        Address address = baseMapper.selectById(id);
        if (address!=null) {
            return Result.success(address);
        }
        return Result.error();
    }
    /**
     * 设置默认地址
     * @param id
     * @return
     */
    @Override
    @Transactional
    public Result setDefaultAddress(Integer id) {
        //首先，将其他默认地址改为非默认
        baseMapper.update(new Address().setIsDefault(false),new LambdaUpdateWrapper<Address>()
                .eq(Address::getIsDefault,true));
        return baseMapper.update(new Address().setIsDefault(true),new LambdaUpdateWrapper<Address>()
                .eq(Address::getId,id)) > 0?Result.success():Result.error();
    }
}
