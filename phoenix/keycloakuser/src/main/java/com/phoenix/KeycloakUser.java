package com.phoenix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
public class KeycloakUser {
    public static void main(String[] args) {
        SpringApplication.run(KeycloakUser.class, args);
    }

}