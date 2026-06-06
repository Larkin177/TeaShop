package com.teashop.repository;

import com.teashop.entity.ProductTopping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductToppingRepository extends JpaRepository<ProductTopping, Long> {
    List<ProductTopping> findByProductId(Long productId);
}
