package com.teashop.repository;

import com.teashop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Integer status);
}
