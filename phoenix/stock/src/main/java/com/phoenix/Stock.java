package com.phoenix;

import com.phoenix.config.CustomPortConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class Stock {
    public static void main(String[] args) {
        SpringApplication.run(Stock.class, args);
    }
}