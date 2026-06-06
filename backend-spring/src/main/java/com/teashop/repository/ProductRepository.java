package com.teashop.repository;

import com.teashop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsRecommendedAndStatus(Integer isRecommended, Integer status);
    List<Product> findByStatusOrderByMonthlySalesDesc(Integer status);
    List<Product> findByCategoryIdAndStatusOrderByMonthlySalesDesc(Long categoryId, Integer status);
    List<Product> findByNameContainingAndStatus(String keyword, Integer status);
}
