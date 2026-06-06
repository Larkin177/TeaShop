package com.teashop.service;

import com.teashop.entity.*;
import com.teashop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final UserCouponRepository userCouponRepository;
    private final AddressRepository addressRepository;

    public Map<String, Object> getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        long orderCount = orderRepository.findByUserIdOrderByCreatedAtDesc(userId).size();
        long completedOrders = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, 4).size();
        long couponCount = userCouponRepository.findByUserIdOrderByIsUsedAscReceivedAtDesc(userId)
                .stream().filter(uc -> uc.getIsUsed() == 0).count();

        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("phone", user.getPhone());
        result.put("nickname", user.getNickname());
        result.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");
        result.put("points", user.getPoints() != null ? user.getPoints() : 0);
        result.put("membership_level", user.getMembershipLevel() != null ? user.getMembershipLevel() : 1);
        result.put("created_at", user.getCreatedAt());
        result.put("order_count", orderCount);
        result.put("completed_orders", completedOrders);
        result.put("coupon_count", couponCount);
        return result;
    }

    public List<Address> getAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
    }

    @Transactional
    public Address addAddress(Long userId, String name, String phone, String address,
                               String detail, Boolean isDefault) {
        if (Boolean.TRUE.equals(isDefault)) {
            List<Address> existing = addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
            for (Address a : existing) {
                a.setIsDefault(0);
                addressRepository.save(a);
            }
        }

        Address addr = new Address();
        addr.setUserId(userId);
        addr.setName(name);
        addr.setPhone(phone);
        addr.setAddress(address);
        addr.setDetail(detail != null ? detail : "");
        addr.setIsDefault(Boolean.TRUE.equals(isDefault) ? 1 : 0);
        return addressRepository.save(addr);
    }

    @Transactional
    public Address updateAddress(Long id, Long userId, String name, String phone,
                                  String address, String detail, Boolean isDefault) {
        Address addr = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("地址不存在"));
        if (!addr.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }

        if (Boolean.TRUE.equals(isDefault)) {
            List<Address> existing = addressRepository.findByUserIdOrderByIsDefaultDescIdDesc(userId);
            for (Address a : existing) {
                a.setIsDefault(0);
                addressRepository.save(a);
            }
        }

        if (name != null) addr.setName(name);
        if (phone != null) addr.setPhone(phone);
        if (address != null) addr.setAddress(address);
        if (detail != null) addr.setDetail(detail);
        if (isDefault != null) addr.setIsDefault(isDefault ? 1 : 0);
        return addressRepository.save(addr);
    }

    @Transactional
    public void deleteAddress(Long id, Long userId) {
        Address addr = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("地址不存在"));
        if (!addr.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }
        addressRepository.delete(addr);
    }
}
