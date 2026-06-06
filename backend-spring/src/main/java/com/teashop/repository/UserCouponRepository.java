package com.teashop.repository;

import com.teashop.entity.UserCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {
    List<UserCoupon> findByUserIdOrderByIsUsedAscReceivedAtDesc(Long userId);
    Optional<UserCoupon> findByUserIdAndCouponId(Long userId, Long couponId);
    Optional<UserCoupon> findByIdAndUserId(Long id, Long userId);
}
