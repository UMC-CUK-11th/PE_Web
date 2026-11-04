package com.umc.movie.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.cors-enabled:true}")
    private boolean corsEnabled;
    @Value("${app.cors-origins}")
    private String[] corsOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (corsEnabled) {
            registry.addMapping("/**").allowedOrigins(corsOrigins)
                    .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("Content-Type", "Accept").maxAge(3600);
        }
    }
}
