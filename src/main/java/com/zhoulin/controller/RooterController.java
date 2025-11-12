package com.zhoulin.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/user/rooter")
@Api(tags = "导航接口")
public class RooterController {


    /**
     * 导航去about.html
     * @return
     */
    @GetMapping("/about")
    @ApiOperation("导航去about.html")
    public String aboutHtml(){
        log.info("导航去about.html");
        return "/html/about";
    }

    /**
     * 导航去contact
     */
    @GetMapping("/contact")
    @ApiOperation("导航去contact.html")
    public String contact(){
        log.info("导航去about.html");
        return "/html/contact";
    }
    /**
     * 导航去Register注册
     *
     */
    @GetMapping("/register")
    @ApiOperation("导航去Register.html")
    public String register(){
        log.info("导航去Register.html");
        return "/html/register";
    }
    /**
     * 导航去faqs
     *
     */
    @GetMapping("/faqs")
    @ApiOperation("导航去faqs.html")
    public String faqs(){
        log.info("导航去faqs.html");
        return "/html/faqs";
    }

    /**
     * 导航去dashboard
     *
     */
    @GetMapping("/dashboard")
    @ApiOperation("导航去dashboard.html")
    public String dashboard(){
        log.info("导航去dashboard.html");
        return "/html/dashboard";
    }

    /**
     * 导航去order List
     *
     */
    @GetMapping("/orderList")
    @ApiOperation("导航去order List")
    public String orderList(){
        log.info("导航去order List.html");
        return "/html/order List";
    }

    /**
     * 导航去Home页面(index)
     *
     */
    @GetMapping("/index")
    @ApiOperation("导航去Home页面,index.html")
    public String index(){
        log.info("导航去Home页面,index.html");
        return "/html/index";
    }

    /**
     * 导航去 reset Passwordl(忘记密码)
     *
     */
    @GetMapping("/resetPassword")
    @ApiOperation("导航去 reset Password(忘记密码)")
    public String resetPasswordl(){
        log.info("导航去 reset Password(忘记密码)");
        return "/html/reset Passwordl";
    }



    /**
     * 导航去 Wishlist(收藏清单)购物车
     *
     */
    @GetMapping("/Wishlist")
    @ApiOperation("导航去 Wishlist(收藏清单)购物车")
    public String Wishlist(){
        log.info("导航去 Wishlist(收藏清单)购物车");
        return "/html/Wishlist";
    }


    /**
     * 导航去 Cart订单列表
     *
     */
    @GetMapping("/Cart")
    @ApiOperation("导航去 Cart订单列表")
    public String Cart(){
        log.info("导航去 Cart订单列表");
        return "/html/Cart";
    }


    /**
     * 导航去  shop Grid订单列表
     *
     */
    @GetMapping("/shopGrid")
    @ApiOperation("导航去  shop Grid订单列表")
    public String  ShopGrid(){
        log.info("导航去  shop Grid订单列表");
        return "/html/shop Grid";
    }

    /**
     * 导航去checkout
     *
     */
    @GetMapping("/checkout")
    @ApiOperation("导航去  checkout表")
    public String  Chectut(){
        log.info("导航去  checkout");
        return "/html/checkout";
    }

    /**
     * 导航去 order Details
     *
     */
    @GetMapping("/orderDetails")
    @ApiOperation("导航去  order Details")
    public String  orderDetails(){
        log.info("导航去  order Details");
        return "/html/order Details";
    }
    /**
     * 导航去 order Details
     *
     */
    @GetMapping("/BlogGrid")
    @ApiOperation("导航去  Blog Grid")
    public String  BlogGrid(){
        log.info("导航去  Blog Grid");
        return "/html/Blog Grid";
    }

    /**
     * 导航去 Blog List
     *
     */
    @GetMapping("/BlogList")
    @ApiOperation("导航去  Blog List")
    public String  BlogList(){
        log.info("导航去  Blog List");
        return "/html/Blog List";
    }

    /**
     * 导航去 order Details
     *
     */
    @GetMapping("/BlogDetails")
    @ApiOperation("导航去  Blog Details")
    public String  BlogDetails(){
        log.info("导航去  order Details");
        return "/html/Blog Details";
    }

    /**
     * 导航去 order Details
     *
     */
    @GetMapping("/shopList")
    @ApiOperation("导航去  shop List")
    public String  shopList(){
        log.info("导航去  shop List");
        return "/html/shop List";
    }

    /**
     * 导航去 Product Details
     *
     */
    @GetMapping("/ProductDetails")
    @ApiOperation("导航去  Product Details")
    public String  ProductDetails(){
        log.info("导航去  Product Details");
        return "/html/Product Details";
    }

    /**
     * 导航去Change Password
     *
     */
    @GetMapping("/ChangePassword")
    @ApiOperation("导航去  Change Password")
    public String  ChangePassword(){
        log.info("导航去  Change Password");
        return "/html/Change Password";
    }

    /**
     * 导航去 Reset Password
     *
     */
    @GetMapping("/ResetPassword")
    @ApiOperation("导航去  Reset Password")
    public String  ResetPassword(){
        log.info("导航去  Reset Password");
        return "/html/Reset Password";
    }

    /**
     * 导航去 Edit Profile
     *
     */
    @GetMapping("/EditProfile")
    @ApiOperation("导航去  Edit Profile")
    public String  EditProfile(){
        log.info("导航去 Edit Profile");
        return "/html/Edit Profile";
    }

    /**
     * 导航去Edit Address
     *
     */
    @GetMapping("/EditAddress")
    @ApiOperation("导航去 Edit Address")
    public String  EditAddress(){
        log.info("导航去 Edit Address");
        return "/html/Edit Address";
    }

    /**
     * 导航去验证码登录
     *
     */
    @GetMapping("/codeLogin")
    @ApiOperation("导航去code Login")
    public String  codeLogin(){
        log.info("导航去 code Login 验证码登录");
        return "/html/code Login";
    }

    /**
     * 导航去验证码登录
     *
     */
    @GetMapping("/testIndex")
    @ApiOperation("导航去testIndex")
    public String  testIndex(){
        log.info("导航去test页面Index");
        return "/text/indexTest";
    }

    @GetMapping("/header")
    public String header(){
        log.info("导航去header");
        return "/html/header";
    }

    @GetMapping("/footer")
    public String foot(){
        return "/html/footer";
    }
}
