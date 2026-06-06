package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFavorites(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(favoriteService.getFavorites(userId)));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> addFavorite(Authentication auth, @PathVariable Long productId) {
        Long userId = (Long) auth.getPrincipal();
        favoriteService.addFavorite(userId, productId);
        return ResponseEntity.ok(ApiResponse.success("收藏成功", null));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(Authentication auth, @PathVariable Long productId) {
        Long userId = (Long) auth.getPrincipal();
        favoriteService.removeFavorite(userId, productId);
        return ResponseEntity.ok(ApiResponse.success("取消收藏", null));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkFavorite(Authentication auth, @PathVariable Long productId) {
        Long userId = (Long) auth.getPrincipal();
        boolean isFav = favoriteService.isFavorite(userId, productId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("status", isFav ? 1 : 0)));
    }
}