package com.phoenix.keycloakuser.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserRegistrationRequest {
    private String username;
    private String password;
    private String role;
}
