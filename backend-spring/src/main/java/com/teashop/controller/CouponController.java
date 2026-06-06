package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAvailable() {
        List<Map<String, Object>> coupons = couponService.getAllAvailableCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<ApiResponse<Void>> claimCoupon(Authentication auth, @PathVariable Long id) {
        try {
            Long userId = (Long) auth.getPrincipal();
            couponService.claimCoupon(id, userId);
            return ResponseEntity.ok(ApiResponse.success("领取成功", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyCoupons(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        List<Map<String, Object>> coupons = couponService.getMyCoupons(userId);
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }
}