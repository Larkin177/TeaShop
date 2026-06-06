package com.teashop.repository;

import com.teashop.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    List<Coupon> findByStatusAndUsedCountLessThan(Integer status, Integer totalCount);
}
