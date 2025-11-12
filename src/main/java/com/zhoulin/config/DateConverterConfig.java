package com.zhoulin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class DateConverterConfig implements Converter<String, LocalDateTime> {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    @Override
    public LocalDateTime convert(String source) {
        // 1.处理 null
        if (source == null ||  source.trim().isEmpty()) {
            return null;
        }
        String trimmedSource = source.trim(); //去除空字符""

        try {
            if (trimmedSource.contains(" ")) { //contains 包含空字符" ”
                return LocalDateTime.parse(trimmedSource, DATE_TIME_FORMATTER);
            }
            else {
                return LocalDate.parse(trimmedSource, DATE_FORMATTER)
                        .atStartOfDay(); // 更优雅的补全凌晨时间方式 00:00:00 时分秒
            }
        }catch (DateTimeParseException e){

            throw new IllegalArgumentException("日期格式错误！支持格式：yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss，当前值：" + trimmedSource);
        }

    }
}
