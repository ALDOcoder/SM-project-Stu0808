package com.zhoulin.controller;


import com.zhoulin.pojo.dto.NewPasswordDTO;
import com.zhoulin.pojo.dto.UserDTO;
import com.zhoulin.pojo.dto.UserLoginByCodeDTO;
import com.zhoulin.pojo.dto.UserLoginByPasswordDTO;
import com.zhoulin.pojo.result.Result;
import com.zhoulin.pojo.vo.UserVO;
import com.zhoulin.service.IUserService;
import com.zhoulin.service.LoginService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;


@Controller
@RequestMapping("user/login")
@Slf4j
@Api(tags = "登录接口")
public class LoginController {


    @Autowired
    private LoginService loginService;

    @Autowired
    private IUserService UserService;

    @GetMapping
    @ApiOperation("登录页面")
    public String login(){
        log.info("跳转登录页面");
        return "/html/login";
    }

    /**
     * 用户密码登录
     *
     * @param userLoginByPasswordDTO
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("用户密码登录接口")
    @ResponseBody
    public Result<String> login(UserLoginByPasswordDTO userLoginByPasswordDTO){
        //登录成功后，返回token给前端,在前端请求后，在token中进行校验,并存入用户信息在ThreadLOCAL中
        log.info("用户密码登录: {}", userLoginByPasswordDTO);
         return loginService.login(userLoginByPasswordDTO);
    }


    /**
     * 用户code验证码登录
     *
     * @param userLoginByCodeDTO
     * @return
     */
    @PostMapping("/loginByCode")
    @ApiOperation("用户验证码登录接口")
    @ResponseBody
    public Result<UserVO> login(UserLoginByCodeDTO userLoginByCodeDTO, HttpSession session){
        log.info("用户验证码登录接口: {}", userLoginByCodeDTO);
        Result result = loginService.loginByCode(userLoginByCodeDTO);
        return result;

    }


    /**
     * 用户请求获取验证码
     * @param phone
     */
    @PostMapping("/code")
    @ApiOperation("用户请求获取验证码")
    @ResponseBody // 告诉 Spring：返回数据（JSON/字符串），而非渲染视图
    public Result sendCode(String phone){
        log.info("用户{}请求获取验证码",phone);
        Result result=loginService.sendCode(phone);
        return result;
    }

    /**
     * resetByCode
     * 用户请求修改密码（账号已经存在）
     */
    @PostMapping("/resetByCode")
    @ApiOperation("用户请求修改密码（账号已经存在）验证code")
    @ResponseBody
    public Result resetPassword(UserLoginByCodeDTO userLoginByCodeDTO){
        log.info("用户请求修改密码（账号已经存在）:{}",userLoginByCodeDTO.getPhone());
        return loginService.resetPassword(userLoginByCodeDTO);
    }

    /**
     * 修改密码
     * @param newPasswordDTO
     * @return
     */
    @PutMapping("/updatePassword")
    @ApiOperation("用户请求修改密码")
    @ResponseBody
    public Result  updatePassword(NewPasswordDTO newPasswordDTO){
        log.info("用户请求修改密码,{},{}",newPasswordDTO.getPhone(),newPasswordDTO.getPassword());
        return UserService.updatePassword(newPasswordDTO);
    }

    /**
     * 用户请求注册账号
     * @param userDTO
     * @return
     */
    @PostMapping("/register")
    @ApiOperation("用户请求注册账号")
    @ResponseBody
    public Result register(UserDTO userDTO){
        log.info("用户请求注册账号,{}",userDTO.getPhone());
        return UserService.createUser(userDTO);
    }

    /**
     * 用户请求注册账号(校验验证码)
     * @param userLoginByCodeDTO
     * @return
     */
    @PostMapping("/registerByCode")
    @ApiOperation("用户请求注册账号")
    @ResponseBody
    public Result registerByCode(UserLoginByCodeDTO userLoginByCodeDTO){
        log.info("用户请求注册账号,{}",userLoginByCodeDTO.getPhone());
        return loginService.createUserByCode(userLoginByCodeDTO);
    }


}
