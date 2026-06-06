package com.teashop.service;

import com.teashop.entity.Favorite;
import com.teashop.entity.Product;
import com.teashop.repository.FavoriteRepository;
import com.teashop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    public List<Map<String, Object>> getFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(fav -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", fav.getId());
                m.put("goodsId", fav.getProductId());
                m.put("productId", fav.getProductId());
                m.put("createdAt", fav.getCreatedAt());
                return m;
            })
            .collect(Collectors.toList());
    }

    @Transactional
    public void addFavorite(Long userId, Long productId) {
        if (!favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            Favorite fav = new Favorite();
            fav.setUserId(userId);
            fav.setProductId(productId);
            favoriteRepository.save(fav);
        }
    }

    @Transactional
    public void removeFavorite(Long userId, Long productId) {
        favoriteRepository.findByUserIdAndProductId(userId, productId)
            .ifPresent(favoriteRepository::delete);
    }

    public boolean isFavorite(Long userId, Long productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }
}