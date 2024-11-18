package com.autocareconnect.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:3000",
                                "http://localhost:3001",
                                "http://localhost:3002",
                                "http://localhost:3003"
                        )
                        .allowedMethods("GET", "POST") // Restrict methods to GET and POST
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true) // Allow credentials if needed
                        .maxAge(3600); // Cache the CORS response for 1 hour
            }
        };
    }
}
