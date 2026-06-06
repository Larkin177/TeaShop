package com.teashop.service;

import com.teashop.entity.*;
import com.teashop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final UserCouponRepository userCouponRepository;

    /**
     * 获取所有可用优惠券（无需登录）
     */
    public List<Map<String, Object>> getAllAvailableCoupons() {
        return couponRepository.findByStatusAndUsedCountLessThan(1, 100).stream()
                .filter(c -> c.getEndTime() == null || c.getEndTime().isAfter(LocalDateTime.now()))
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", c.getId());
                    m.put("name", c.getName());
                    m.put("type", c.getType());
                    m.put("value", c.getValue());
                    m.put("min_amount", c.getMinAmount());
                    m.put("start_time", c.getStartTime());
                    m.put("end_time", c.getEndTime());
                    m.put("description", c.getDescription());
                    return m;
                }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAvailableCoupons(Long userId) {
        List<Coupon> coupons = couponRepository.findByStatusAndUsedCountLessThan(1, 100);
        List<UserCoupon> userCoupons = userCouponRepository.findByUserIdOrderByIsUsedAscReceivedAtDesc(userId);
        Set<Long> claimedIds = userCoupons.stream()
                .map(UserCoupon::getCouponId).collect(Collectors.toSet());

        return coupons.stream()
                .filter(c -> !claimedIds.contains(c.getId()))
                .filter(c -> c.getEndTime() == null || c.getEndTime().isAfter(LocalDateTime.now()))
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", c.getId());
                    m.put("name", c.getName());
                    m.put("type", c.getType());
                    m.put("value", c.getValue());
                    m.put("min_amount", c.getMinAmount());
                    m.put("start_time", c.getStartTime());
                    m.put("end_time", c.getEndTime());
                    m.put("description", c.getDescription());
                    return m;
                }).collect(Collectors.toList());
    }

    @Transactional
    public void claimCoupon(Long couponId, Long userId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException("优惠券不存在"));
        if (coupon.getStatus() != 1) {
            throw new RuntimeException("优惠券已失效");
        }
        if (coupon.getUsedCount() >= coupon.getTotalCount()) {
            throw new RuntimeException("优惠券已领完");
        }

        Optional<UserCoupon> existing = userCouponRepository.findByUserIdAndCouponId(userId, couponId);
        if (existing.isPresent()) {
            throw new RuntimeException("您已领取过该优惠券");
        }

        UserCoupon uc = new UserCoupon();
        uc.setUserId(userId);
        uc.setCouponId(couponId);
        userCouponRepository.save(uc);

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
    }

    public List<Map<String, Object>> getMyCoupons(Long userId) {
        List<UserCoupon> userCoupons = userCouponRepository.findByUserIdOrderByIsUsedAscReceivedAtDesc(userId);
        return userCoupons.stream().map(uc -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", uc.getId());
            m.put("coupon_id", uc.getCouponId());
            m.put("is_used", uc.getIsUsed());
            m.put("received_at", uc.getReceivedAt());
            m.put("used_at", uc.getUsedAt());

            couponRepository.findById(uc.getCouponId()).ifPresent(c -> {
                m.put("name", c.getName());
                m.put("type", c.getType());
                m.put("value", c.getValue());
                m.put("min_amount", c.getMinAmount());
                m.put("start_time", c.getStartTime());
                m.put("end_time", c.getEndTime());
                m.put("description", c.getDescription());
            });
            return m;
        }).collect(Collectors.toList());
    }
}