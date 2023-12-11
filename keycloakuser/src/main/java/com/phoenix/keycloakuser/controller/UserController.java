package com.phoenix.keycloakuser.controller;
import com.phoenix.keycloakuser.services.KeycloakUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private KeycloakUserService keycloakUserService;

    @PostMapping("/register")
    public String registerUser(@RequestParam String username, @RequestParam String password) {
        // Register user and assign role
        keycloakUserService.registerUser(username, password, "IMANAGER");
        return "User registered successfully";
    }
}
