package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.entity.Address;
import com.teashop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserInfo(Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            Map<String, Object> info = userService.getUserInfo(userId);
            return ResponseEntity.ok(ApiResponse.success(info));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, e.getMessage()));
        }
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<Address>>> getAddresses(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        List<Address> addresses = userService.getAddresses(userId);
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<Address>> addAddress(Authentication auth, @RequestBody Map<String, Object> body) {
        try {
            Long userId = (Long) auth.getPrincipal();
            String name = (String) body.get("name");
            String phone = (String) body.get("phone");
            String address = (String) body.get("address");
            String detail = (String) body.get("detail");
            Boolean isDefault = body.get("is_default") != null && Boolean.TRUE.equals(body.get("is_default"));

            if (name == null || phone == null || address == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error(400, "姓名、手机号和地址不能为空"));
            }

            Address addr = userService.addAddress(userId, name, phone, address, detail, isDefault);
            return ResponseEntity.ok(ApiResponse.success("添加成功", addr));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Address>> updateAddress(Authentication auth, @PathVariable Long id,
                                                               @RequestBody Map<String, Object> body) {
        try {
            Long userId = (Long) auth.getPrincipal();
            String name = (String) body.get("name");
            String phone = (String) body.get("phone");
            String address = (String) body.get("address");
            String detail = (String) body.get("detail");
            Boolean isDefault = body.get("is_default") != null && Boolean.TRUE.equals(body.get("is_default"));

            Address addr = userService.updateAddress(id, userId, name, phone, address, detail, isDefault);
            return ResponseEntity.ok(ApiResponse.success("更新成功", addr));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(Authentication auth, @PathVariable Long id) {
        try {
            Long userId = (Long) auth.getPrincipal();
            userService.deleteAddress(id, userId);
            return ResponseEntity.ok(ApiResponse.success("删除成功", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }
}
