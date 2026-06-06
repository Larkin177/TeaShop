package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.dto.LoginRequest;
import com.teashop.dto.RegisterRequest;
import com.teashop.entity.User;
import com.teashop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody RegisterRequest req) {
        try {
            if (req.getPhone() == null || req.getPassword() == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "手机号和密码不能为空"));
            }
            if (!req.getPhone().matches("^1\\d{10}$")) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "手机号格式不正确"));
            }
            Map<String, Object> result = authService.register(req.getPhone(), req.getPassword(), req.getNickname());
            return ResponseEntity.ok(ApiResponse.success("注册成功", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest req) {
        try {
            Map<String, Object> result = authService.login(req.getPhone(), req.getPassword());
            return ResponseEntity.ok(ApiResponse.success("登录成功", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    /**
     * 微信小程序一键登录
     * POST /api/auth/wx-mini-login
     * Body: { code: string, nickname?: string, avatar?: string }
     */
    @PostMapping("/wx-mini-login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> wxMiniLogin(@RequestBody Map<String, Object> body) {
        try {
            String code = (String) body.get("code");
            if (code == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error(400, "缺少code参数"));
            }
            String nickname = (String) body.get("nickname");
            String avatar = (String) body.get("avatar");
            Map<String, Object> result = authService.wxMiniLogin(code, nickname, avatar);
            return ResponseEntity.ok(ApiResponse.success("登录成功", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    /**
     * 微信小程序注册（完善信息）
     * POST /api/auth/wx-mini-register
     * Body: { code: string, encryptedData: string, iv: string, referrer?: string }
     */
    @PostMapping("/wx-mini-register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> wxMiniRegister(@RequestBody Map<String, Object> body) {
        try {
            String code = (String) body.get("code");
            String encryptedData = (String) body.get("encryptedData");
            String iv = (String) body.get("iv");
            String referrer = (String) body.get("referrer");
            if (code == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error(400, "缺少code参数"));
            }
            Map<String, Object> result = authService.wxMiniRegister(code, encryptedData, iv, referrer);
            return ResponseEntity.ok(ApiResponse.success("注册成功", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            User user = authService.getProfile(userId);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(Authentication auth, @RequestBody Map<String, String> body) {
        try {
            Long userId = (Long) auth.getPrincipal();
            User user = authService.updateProfile(userId, body.get("nickname"), body.get("avatar"));
            return ResponseEntity.ok(ApiResponse.success("更新成功", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }
}
