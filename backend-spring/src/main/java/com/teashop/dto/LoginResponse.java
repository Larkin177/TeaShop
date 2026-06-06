package com.teashop.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Object user;
}
