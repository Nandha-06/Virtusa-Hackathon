package com.devcoders.dlvery.dto;

import com.devcoders.dlvery.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private UserRole role;
    private String token;
    private String tokenType = "Bearer";
}