package com.zhoulin.controller;

import cn.hutool.core.util.StrUtil;
import com.zhoulin.constant.SystemConstants;
import com.zhoulin.pojo.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

/**
 * 头像照片的上传
 */

@RestController
@RequestMapping("/user/profile")
@Slf4j
@Api(tags = "头像照片的上传")
public class ProfileController {

    @PostMapping("/photo")
    @ApiOperation("上传头像")
    public Result putPhoto(@RequestParam("avatar") MultipartFile file){
        try {
            // 获取原始文件的名称
            String originalFilename = file.getOriginalFilename();

            //生成新的文件名称
            String newFileName = createNewFileName(originalFilename);
            //保存文件 保存位置
            file.transferTo(new File(SystemConstants.IMAGE_UPLOAD_DIR, newFileName));
            //返回结果
            log.debug("文件上传成功.{}",newFileName);
            return Result.success(StrUtil.format(SystemConstants.IMAGE_LOCATION_SUFFIX, newFileName));
        }catch (IOException e){
            throw  new RuntimeException(SystemConstants.IMAGE_UPLOAD_ERROR,e);
        }
    }




    public String createNewFileName(String originalFilename){
        // 获取后缀
        String suffix = StrUtil.subAfter(originalFilename, ".", true);
        // 生成目录
        String name = UUID.randomUUID().toString();
        int hash = name.hashCode();
        int d1 = hash & 0xF;
        int d2 = (hash >> 4) & 0xF;
        // 判断目录是否存在
        File dir = new File(SystemConstants.IMAGE_UPLOAD_DIR,StrUtil.format("/{}/{}", d1, d2));
        if(!dir.exists()){
            dir.mkdirs();
        }
        // 生成文件名
        return StrUtil.format("/{}/{}/{}.{}", d1, d2, name, suffix);

    }
}
