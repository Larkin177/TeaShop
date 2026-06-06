package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.entity.Banner;
import com.teashop.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerRepository bannerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Banner>>> getBanners() {
        List<Banner> banners = bannerRepository.findByStatusOrderBySortOrderAsc(1);
        return ResponseEntity.ok(ApiResponse.success(banners));
    }
}
