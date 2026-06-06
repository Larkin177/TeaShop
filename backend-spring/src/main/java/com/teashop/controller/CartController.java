package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.entity.Cart;
import com.teashop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cart>>> getCart(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        List<Cart> items = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Cart>> addItem(Authentication auth, @RequestBody Map<String, Object> body) {
        try {
            Long userId = (Long) auth.getPrincipal();
            Long productId = Long.valueOf(body.get("product_id").toString());
            @SuppressWarnings("unchecked")
            Map<String, Object> specs = (Map<String, Object>) body.get("specs");
            @SuppressWarnings("unchecked")
            List<Integer> toppings = (List<Integer>) body.get("toppings");
            Integer quantity = body.get("quantity") != null ? Integer.valueOf(body.get("quantity").toString()) : 1;

            Cart cart = cartService.addItem(userId, productId, specs, toppings, quantity);
            return ResponseEntity.ok(ApiResponse.success("已加入购物车", cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Cart>> updateQuantity(Authentication auth, @PathVariable Long id,
                                                             @RequestBody Map<String, Object> body) {
        try {
            Long userId = (Long) auth.getPrincipal();
            Integer quantity = Integer.valueOf(body.get("quantity").toString());
            if (quantity < 1) {
                return ResponseEntity.badRequest().body(ApiResponse.error(400, "数量必须大于0"));
            }
            Cart cart = cartService.updateQuantity(id, userId, quantity);
            return ResponseEntity.ok(ApiResponse.success("更新成功", cart));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeItem(Authentication auth, @PathVariable Long id) {
        try {
            Long userId = (Long) auth.getPrincipal();
            cartService.removeItem(id, userId);
            return ResponseEntity.ok(ApiResponse.success("已移除", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("购物车已清空", null));
    }
}
