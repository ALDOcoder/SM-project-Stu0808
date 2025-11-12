package com.zhoulin.service;

import com.zhoulin.pojo.dto.UserLoginByCodeDTO;
import com.zhoulin.pojo.dto.UserLoginByPasswordDTO;
import com.zhoulin.pojo.result.Result;

public interface LoginService {

    /**
     * 员工登录接口
     *
     * @param userLoginByPasswordDTO
     */
    Result<String> login(UserLoginByPasswordDTO userLoginByPasswordDTO);

    Result loginByCode(UserLoginByCodeDTO userLoginByCodeDTO);

    Result sendCode(String phone);

    Result resetPassword(UserLoginByCodeDTO userLoginByCodeDTO);

    Result createUserByCode(UserLoginByCodeDTO userLoginByCodeDTO);
}
