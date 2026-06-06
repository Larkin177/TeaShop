package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.entity.Store;
import com.teashop.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository storeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Store>>> getStores() {
        List<Store> stores = storeRepository.findByStatus(1);
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Store>> getStoreDetail(@PathVariable Long id) {
        return storeRepository.findById(id)
                .map(store -> ResponseEntity.ok(ApiResponse.success(store)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error(404, "门店不存在")));
    }
}
