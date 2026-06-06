package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(Authentication auth,
                                                                          @RequestBody Map<String, Object> body) {
        try {
            Long userId = (Long) auth.getPrincipal();
            Long storeId = Long.valueOf(body.get("store_id").toString());
            Long couponId = body.get("coupon_id") != null ? Long.valueOf(body.get("coupon_id").toString()) : null;
            String remark = (String) body.get("remark");

            Map<String, Object> result = orderService.createOrder(userId, storeId, couponId, remark);
            return ResponseEntity.ok(ApiResponse.success("下单成功", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrders(Authentication auth,
                                                                              @RequestParam(required = false) Integer status) {
        Long userId = (Long) auth.getPrincipal();
        List<Map<String, Object>> orders = orderService.getOrders(userId, status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrderDetail(Authentication auth, @PathVariable Long id) {
        try {
            Long userId = (Long) auth.getPrincipal();
            Map<String, Object> order = orderService.getOrderDetail(id, userId);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(Authentication auth, @PathVariable Long id) {
        try {
            Long userId = (Long) auth.getPrincipal();
            orderService.cancelOrder(id, userId);
            return ResponseEntity.ok(ApiResponse.success("订单已取消", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<Void>> payOrder(Authentication auth, @PathVariable Long id) {
        try {
            Long userId = (Long) auth.getPrincipal();
            orderService.payOrder(id, userId);
            return ResponseEntity.ok(ApiResponse.success("支付成功", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Void>> completeOrder(Authentication auth, @PathVariable Long id) {
        try {
            Long userId = (Long) auth.getPrincipal();
            orderService.completeOrder(id, userId);
            return ResponseEntity.ok(ApiResponse.success("订单已完成", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }
}
