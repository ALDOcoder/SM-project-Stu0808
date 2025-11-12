package com.zhoulin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhoulin.pojo.dto.UserLoginByCodeDTO;
import com.zhoulin.pojo.dto.UserLoginByPasswordDTO;
import com.zhoulin.pojo.entity.User;
import org.apache.ibatis.annotations.Insert;

import java.time.LocalDateTime;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author zhuoulin
 * @since 2025-08-18
 */

public interface UserMapper extends BaseMapper<User> {
    /**
     * 用户密码登录
     * @param userLoginByPasswordDTO
     * @return
     */
    User login(UserLoginByPasswordDTO userLoginByPasswordDTO);

    /**
     * 用户验证码登录
     * @param userLoginByCodeDTO
     * @return
     */
    Integer loginByCode(UserLoginByCodeDTO userLoginByCodeDTO);


    @Insert("insert into usercode(phone,code,created_time)values (#{phone},#{code},#{createdTime})")
    void save(String phone, Integer code, LocalDateTime createdTime);


    void createdUser(User buildUser);
}
