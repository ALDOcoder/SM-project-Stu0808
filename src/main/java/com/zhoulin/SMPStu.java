package com.zhoulin;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
@MapperScan("com.zhoulin.mapper")
public class SMPStu {
    public static void main(String[] args) {
        SpringApplication.run(SMPStu.class,args);
    }
}
