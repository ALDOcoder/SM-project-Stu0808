package com.zhoulin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhoulin.pojo.dto.CartUpdateDTO;
import com.zhoulin.pojo.dto.NewPasswordDTO;
import com.zhoulin.pojo.dto.UserDTO;
import com.zhoulin.pojo.entity.User;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.CartVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-08-18
 */
public interface IUserService extends IService<User> {

    Result updatePassword(NewPasswordDTO newPasswordDTO);

    Result createUser(UserDTO userDTO);

    /**
     *  订阅
     * @param phone
     * @return
     */
    Result UserSubscript(String phone);

    /**
     *  添加购物车
     * @param productId
     * @return
     */
    Result addCarted(Integer productId);
    /**
     * 查询购物车
     *
     * @return
     */
    Result<List<CartVO>> queryCarted();
    /**
     * 删除购物车
     * 删除单个物品
     * @param productId
     * @return
     */
    Result deleteByProductId(Integer productId);


    /**
     * 更新购物车数量
     * @param cartUpdateDTO
     * @return
     */
    Result updateQuantity(CartUpdateDTO cartUpdateDTO);
}
