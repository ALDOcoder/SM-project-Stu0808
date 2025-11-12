package com.zhoulin.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhoulin.constant.UserConstant;
import com.zhoulin.exception.UserLoginException;
import com.zhoulin.mapper.CartMapper;
import com.zhoulin.mapper.ProductsMapper;
import com.zhoulin.mapper.UserMapper;
import com.zhoulin.mapper.UserTagsMapper;
import com.zhoulin.pojo.dto.CartUpdateDTO;
import com.zhoulin.pojo.dto.NewPasswordDTO;
import com.zhoulin.pojo.dto.UserDTO;
import com.zhoulin.pojo.entity.Cart;
import com.zhoulin.pojo.entity.Products;
import com.zhoulin.pojo.entity.User;
import com.zhoulin.pojo.entity.UserTags;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.CartVO;
import com.zhoulin.service.IUserService;
import com.zhoulin.utils.LoginUtils;
import com.zhoulin.utils.UserHolder;
import com.zhoulin.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author zhuoulin
 * @since 2025-08-18
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {


    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserTagsMapper userTagsMapper;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private ProductsMapper productMapper;

    @Override
    public Result updatePassword(NewPasswordDTO newPasswordDTO) {
        //校验两次输入的密码是否一致
        String password = LoginUtils.checkLoginPassword(newPasswordDTO.getPassword());
        String passwordAgain = LoginUtils.checkLoginPassword(newPasswordDTO.getPasswordAgain());
        //判断两次密码是否一致
        if (!password.equals(passwordAgain)){
            throw new UserLoginException(UserConstant.UPDATE_PASSWORD_DIFFERENT);
        }
        //校验电话
        LoginUtils.checkLoginPhone(newPasswordDTO.getPhone());
        //修改账号
        // 1. 构建更新专用的条件构造器
        LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();

        updateWrapper.set(User::getPassword,password)
                .set(User::getUpdateTime,LocalDateTime.now());
        updateWrapper.eq(User::getPhone, newPasswordDTO.getPhone());
        int update = userMapper.update(null, updateWrapper);
        return update==1?Result.success():Result.error();
    }

    /**
     * 用户请求注册账号
     * @param userDTO
     * @return
     */
    @Override
    public Result createUser(UserDTO userDTO) {
        //校验用户信息密码
        String userName=userDTO.getUsername();
        if (!userDTO.getPassword().equals(userDTO.getPasswordAgain())) {
            throw new UserLoginException(UserConstant.REGISTER_PASSWORD_DIFFERENT);
        }
        //校验密码
        String password = LoginUtils.checkLoginPassword(userDTO.getPassword());
        if(userName == null){
            userName = UserUtils.createdUserName();
        }
        User user = User.builder()
                .username(userName)
                .phone(userDTO.getPhone())
                .password(password)
                .sex(userDTO.getSex())
                .status(UserConstant.USER_STATUS_SUCCESS)
                .roleId(UserConstant.USER_ROLE_ID)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .createUser("10086")
                .updateUser("10086")
                .build();
        userMapper.createdUser(user);
        return Result.success();
    }

    /**
     * 用户订阅
     * @param phone
     * @return
     */
    @Override
    public Result UserSubscript(String phone) {
        // 1. 校验手机号
        LoginUtils.checkLoginPhone(phone);
        // 2.判断是输入的手机号是否是自己的
        if (!phone.equals(UserHolder.getUser().getPhone())){
            return Result.error(UserConstant.USER_SUBSCRIPT_ERROR);
        }
        // 3.判断账号是否已经订阅
        LambdaUpdateWrapper<UserTags> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(UserTags::getUserPhone,phone)
                .eq(UserTags::getTagsId,UserConstant.USER_SUBSCRIPT_TAGS_ID);
        UserTags userTags = userTagsMapper.selectOne(wrapper);
        if (userTags != null){
            return Result.error(UserConstant.USER_SUBSCRIPT_EXIST);
        }
        UserTags userTag = UserTags.builder()
                .userPhone(phone)
                .tagsId(UserConstant.USER_SUBSCRIPT_TAGS_ID)
                .described("用户订阅")
                .createdTime(LocalDateTime.now())
                .build();
        return userTagsMapper.insertOrUpdate(userTag) ? Result.success() : Result.error();

    }


    /**
     * 添加购物车
     * @param productId
     * @return
     */
    @Override
    public Result addCarted(Integer productId) {
        // 1.获取用户的id
        Long userId = UserHolder.getUser().getId();
        // 2.判断是不是初次添加该商品
        LambdaUpdateWrapper<Cart> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Cart::getUserId,userId)
                .eq(Cart::getProductId,productId);
        Cart cart = cartMapper.selectOne(wrapper);
        if (cart != null){
            // 3.不是初次添加 则更新数量
            cart.setQuantity(cart.getQuantity()+1);
            return cartMapper.update(cart,wrapper) > 0 ? Result.success() : Result.error();
        }
        // 4.是初次添加 构建添加对象
        // 4.1 查询商品信息
        Products product = productMapper.selectById(productId);
        Cart buildCart = Cart.builder()
                .userId(userId)
                .productId(Long.valueOf(productId))
                .quantity(1)
                .price(product.getSalePrice())
                .createdTime(LocalDateTime.now())
                .updatedTime(LocalDateTime.now())
                .isDeleted(false)
                .build();
        return cartMapper.insert(buildCart) > 0 ? Result.success() : Result.error();
    }


    /**
     * 查询购物车
     *
     * @return
     */
    @Override
    public Result<List<CartVO>> queryCarted() {
        // 1.获取用户的id
        Long userId = UserHolder.getUser().getId();
        // 2.查询购物车
        List<CartVO> cartVOList = cartMapper.queryCarted(userId);
       // 3.判断购物车是否为空
        return cartVOList.isEmpty() ? Result.success(Collections.emptyList()) : Result.success(cartVOList,Long.valueOf(cartVOList.size()));
    }
    /**
     * 删除购物车物品
     * @param productId
     * @return
     */
    @Override
    public Result deleteByProductId(Integer productId) {
        // 1。获取当前用户的id
        Long userId = UserHolder.getUser().getId();
        // 2.构造删除条件
        LambdaUpdateWrapper<Cart> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Cart::getUserId,userId)
                .eq(Cart::getProductId,productId);
        return cartMapper.delete(wrapper) > 0 ? Result.success() : Result.error();
    }

    /**
     * 更新购物车数量
     * @param cartUpdateDTO
     * @return
     */
    @Override
    public Result updateQuantity(CartUpdateDTO cartUpdateDTO) {
        // 1.校验数据
        if(cartUpdateDTO.getProductId()==null&&cartUpdateDTO.getQuantity()==null){
            return Result.error(UserConstant.CART_UPDATE_ERROR);
        }
        //判断购物车物品数量
        if(cartUpdateDTO.getQuantity()<=0){
            //数量小于或等于0，直接删除该条数据
            return  deleteByProductId(cartUpdateDTO.getProductId());
        }
        //执行跟新操作

        // 2. 获取当前用户的id
        Long userId = UserHolder.getUser().getId();
        Cart cart = Cart.builder()
                .quantity(cartUpdateDTO.getQuantity())
                .build();
        LambdaUpdateWrapper<Cart> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Cart::getUserId,userId)
                .eq(Cart::getProductId,cartUpdateDTO.getProductId());
        return cartMapper.update(cart, wrapper) > 0 ? Result.success() : Result.error();
    }


}
