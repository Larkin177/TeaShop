package com.teashop.dto;

import lombok.Data;
import java.util.Map;

@Data
public class LoginRequest {
    private String phone;
    private String password;
}
