package com.zhoulin;

import io.jsonwebtoken.*;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

public class Test {

    private long expireTime = 24*60*60*1000;//单位采用的默认是毫米 1天时间
    private String secret = "zhoulin_CFM_BBB_zhoulin_CFM_BBB_12345678";

    private String sginature ="ZHOU_LIN_2025_09_10_16_30_COMPETE";
    @org.junit.jupiter.api.Test
    public void testJwt(){
        //构建jwt 对象
        JwtBuilder jwtBuilder = Jwts.builder();

        String token = jwtBuilder
                //header
                .setHeaderParam("alg","HS256")
                .setHeaderParam("type","JWT")
                //payload
                .claim("username","zhangsan")
                .claim("password","<PASSWORD>")
                .claim("phone","1234567890")
                .setSubject("userTest")
                //有效时间
                .setExpiration(new Date(System.currentTimeMillis()+expireTime))
                //设置jwt 的id
                .setId(UUID.randomUUID().toString())
                //设置签名
                .signWith(SignatureAlgorithm.HS256,sginature.getBytes(StandardCharsets.UTF_8))
                //构建拼接header  payload signature
                .compact();
        System.out.println(token);

    }

    @org.junit.jupiter.api.Test
    public void parseJwt(){
        String token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwaG9uZSI6IjE4NTA4OTU4MzkzIiwidXNlcm5hbWUiOiJM57u_6Imy6ZuG5biC55So5oi3X3loa3FwYm54eWUiLCJleHAiOjE3NTc0OTYzMDksImlhdCI6MTc1NzQ5NDUwOSwic3ViIjoiWmhvdUxpbiJ9.DBijubD6LJAO2SmWn7FC2wfIharujMedgmYfM25MiR0";
        //解密jwt
        JwtParser jwtParser = Jwts.parser();
        Jws<Claims> claimsJws = jwtParser.setSigningKey(sginature.getBytes(StandardCharsets.UTF_8)).parseClaimsJws(token);
        //获取header
        JwsHeader header = claimsJws.getHeader();
        //获取payload
        Claims claims = claimsJws.getBody();
        System.out.println("claims.get(\"username\") = " + claims.get("username"));
        System.out.println("claims.get(\"password\") = " + claims.get("password"));
        System.out.println("claims.get(\"phone\") = " + claims.get("phone"));
        System.out.println("claims.getSubject() = " + claims.getSubject());
        System.out.println("claims.getExpiration() = " + claims.getExpiration());
    }
}