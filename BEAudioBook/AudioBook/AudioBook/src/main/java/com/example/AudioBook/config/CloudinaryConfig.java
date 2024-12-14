package com.example.AudioBook.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary(){
        final Map<String,String> config = new HashMap<>();
        config.put("cloud_name","dr4h3g2af");
        config.put("api_key","274118756767834");
        config.put("api_secret","WZxX64dpT06Mc31TPDmNNSOzkTQ");
        return new Cloudinary(config);
    }
}
