package com.zhoulin;

import io.jsonwebtoken.*;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

public class JWTTest {

    private long exp = 1000 *60 *30L;
    private String signWith="ZHOU_LIN_2025_09_10_16_30_COMPETE";

    @Test
    public void generateToken(){

        HashMap<String,Object> header=new HashMap<>();
        header.put("typ","jwt");
        header.put("alg","HS256");

        HashMap<String,Object> ployer=new HashMap<>();
        ployer.put("username","Zhoulin");
        ployer.put("password","ZL123456");
        ployer.put("phoneNumber","18770381319");
        ployer.put("profile","http://www.baidu.com");
        JwtBuilder jwtBuilder = Jwts.builder()
                .setHeaderParams(header)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setSubject("TestJWT(JASON Web Token)")
                .setExpiration(new Date(System.currentTimeMillis() + exp))
                .setId(UUID.randomUUID().toString())
                .setClaims(ployer)
                .signWith(SignatureAlgorithm.HS256, signWith.getBytes(StandardCharsets.UTF_8));
        String token = jwtBuilder.compact();
        System.out.println(token);

    }



    @Test
    public void parseToken(){


        String token = "eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZSI6IjE4NzcwMzgxMzE5IiwidXNlcklkIjoxMDA4NiwiZXhwIjoxNzU4MTg1MjM1fQ.B9j79zJTSVvmygPRDacx8KIEtXkHzUqIIlxrX0YqdYo";



        JwtParser jwtParser = Jwts.parser();
        Jws<Claims> claimsJws = jwtParser.setSigningKey(signWith.getBytes(StandardCharsets.UTF_8)).parseClaimsJws(token);
        Claims body = claimsJws.getBody();
        System.out.println("claimsJws.getSignature() = " + claimsJws.getSignature());
        System.out.println("body.get(\"username\") = " + body.get("username"));
        System.out.println("body.get(\"phone\") = " + body.get("phone"));
        System.out.println("body.get(\"profile\") = " + body.get("profile"));
        System.out.println("body.getExpiration() = " + body.getExpiration());
        System.out.println("body.getIssuedAt() = " + body.getIssuedAt());
        System.out.println("body.getSubject() = " + body.getSubject());
        System.out.println("body.getId() = " + body.getId());


    }
}
