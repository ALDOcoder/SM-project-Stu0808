package com.zhoulin.service.impl;

import com.zhoulin.constant.JwtClaimsConstant;
import com.zhoulin.constant.LoginConstant;
import com.zhoulin.constant.UserConstant;
import com.zhoulin.exception.UserLoginException;
import com.zhoulin.mapper.UserMapper;
import com.zhoulin.pojo.dto.UserLoginByCodeDTO;
import com.zhoulin.pojo.dto.UserLoginByPasswordDTO;
import com.zhoulin.pojo.entity.User;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.UserVO;
import com.zhoulin.properties.JwtProperties;
import com.zhoulin.service.LoginService;
import com.zhoulin.utils.CodeUtils;
import com.zhoulin.utils.JwtUtil;
import com.zhoulin.utils.LoginUtils;
import com.zhoulin.utils.UserUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@Service
@Slf4j
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtProperties jwtProperties;

    private String tokenCreated(User user){
        //登录成功后，生成jwt令牌
        Map<String,Object> claims = new HashMap<>();
        claims.put(JwtClaimsConstant.PHONE, user.getPhone());
        claims.put(JwtClaimsConstant.EMP_ID,user.getId() );
        return JwtUtil.createJWT(jwtProperties.getSecretKey(), jwtProperties.getTokenTtl(), claims);
    }

    /**
     * 员工登录
     *
     * @param userLoginByPasswordDTO
     */
    @Override
    public Result<String> login(UserLoginByPasswordDTO userLoginByPasswordDTO) {
        //校验密码
        LoginUtils.checkLoginPhone(userLoginByPasswordDTO.getPhone());
        String password = LoginUtils.checkLoginPassword(userLoginByPasswordDTO.getPassword());
        userLoginByPasswordDTO.setPassword(password);
        User employee= userMapper.login(userLoginByPasswordDTO);
        //判断employee是否为空
        if(employee == null){
            throw new UserLoginException(LoginConstant.LOGIN_ID_ERROR);
        }
        return Result.success(tokenCreated(employee),LoginConstant.LOGIN_USER_SUCCESS);
    }

    @Override
    @Transactional
    public Result loginByCode(UserLoginByCodeDTO userLoginByCodeDTO) {
        //校验密码
        LoginUtils.checkLoginPhone(userLoginByCodeDTO.getPhone());
        LoginUtils.checkLoginCode(userLoginByCodeDTO.getCode());
        //在数据库中查询数据
        //TODO 改进可以在redis查询更好
        Integer codeId= userMapper.loginByCode(userLoginByCodeDTO);
        //判断codeId是否为空
        if(codeId==null) throw new UserLoginException(LoginConstant.LOGIN_CODE_ERROR);
        //不为空去userMapper中查询
        UserLoginByPasswordDTO userLoginByPasswordDTO = new UserLoginByPasswordDTO();
        userLoginByPasswordDTO.setPhone(userLoginByCodeDTO.getPhone());
        User user = userMapper.login(userLoginByPasswordDTO);
        //判断employee是否为空
        if(user != null){
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return Result.success(userVO);
        }
        //user为空，说明是新用户 直接可以完成初步操作注册新用户
        User buildUser = User.builder()
                .phone(userLoginByCodeDTO.getPhone())
                .password(LoginUtils.checkLoginPassword(UserConstant.NEW_USER_PASSWORD))
                .username(UserUtils.createdUserName())
                .roleId(UserConstant.USER_ROLE_ID)
                .status(UserConstant.USER_STATUS_SUCCESS)
                .createTime(LocalDateTime.now())
                .createUser("10086")
                .build();
        userMapper.createdUser(buildUser);
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(buildUser, userVO);
        return Result.success(tokenCreated(buildUser),UserConstant. NEW_USER_REGISTER);

    }

    /**
     * 用户请求获取验证码
     *
     * @param phone
     * @return
     */
    @Override
    public Result sendCode(String phone) {
        LoginUtils.checkLoginPhone(phone);
        Integer code = CodeUtils.sendLoginCode();
        LocalDateTime createdTime = LocalDateTime.now();
        userMapper.save(phone,code,createdTime);
        return Result.success(code,"验证码发送成功");
    }



    /**
     * resetByCode
     * 用户请求修改密码（账号已经存在）
     */
    @Override
    public Result resetPassword(UserLoginByCodeDTO userLoginByCodeDTO) {
        //校验手机的格式
        LoginUtils.checkLoginPhone(userLoginByCodeDTO.getPhone());
        //校验验证码格式
        LoginUtils.checkLoginCode(userLoginByCodeDTO.getCode());
        //查询手机是否已经注册
        User user = userMapper.login(new UserLoginByPasswordDTO(userLoginByCodeDTO.getPhone(), null));
        if(user==null){
            throw new UserLoginException(LoginConstant.LOGIN_USER_NOT_EXIST);
        }
        Integer codeId= userMapper.loginByCode(userLoginByCodeDTO);
        if(codeId==null) throw new UserLoginException(LoginConstant.LOGIN_CODE_ERROR);
        return Result.success();
    }

    /**
     * createUserByCode
     * 用户请求注册账号验证 code(账号要不存在)
     */
    @Override
    public Result createUserByCode(UserLoginByCodeDTO userLoginByCodeDTO) {
        //校验手机的格式
        LoginUtils.checkLoginPhone(userLoginByCodeDTO.getPhone());
        //校验验证码格式
        LoginUtils.checkLoginCode(userLoginByCodeDTO.getCode());
        //查询手机是否已经注册
        User user = userMapper.login(new UserLoginByPasswordDTO(userLoginByCodeDTO.getPhone(), null));
        if(user!=null){
            throw new UserLoginException(LoginConstant.LOGIN_USER_EXIST);
        }
        Integer codeId= userMapper.loginByCode(userLoginByCodeDTO);
        if(codeId==null) throw new UserLoginException(LoginConstant.LOGIN_CODE_ERROR);
        return Result.success();
    }
}
