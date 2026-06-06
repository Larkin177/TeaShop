package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.entity.Category;
import com.teashop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        List<Category> categories = productService.getCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/products/recommended")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecommended() {
        List<Map<String, Object>> products = productService.getRecommendedProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getProducts(
            @RequestParam(required = false) Long category_id,
            @RequestParam(required = false) String keyword) {
        List<Map<String, Object>> products = productService.getProducts(category_id, keyword);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductDetail(@PathVariable Long id) {
        try {
            Map<String, Object> product = productService.getProductDetail(id);
            return ResponseEntity.ok(ApiResponse.success(product));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, e.getMessage()));
        }
    }
}
