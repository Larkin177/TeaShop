package com.teashop.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teashop.entity.*;
import com.teashop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserCouponRepository userCouponRepository;
    private final CouponRepository couponRepository;

    @Transactional
    public Map<String, Object> createOrder(Long userId, Long storeId, Long couponId, String remark) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("门店不存在或已关闭"));

        List<Cart> cartItems = cartRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("购物车为空");
        }

        // Calculate total
        double totalPrice = 0;
        for (Cart item : cartItems) {
            totalPrice += item.getUnitPrice() * item.getQuantity();
        }
        totalPrice = Math.round(totalPrice * 100.0) / 100.0;

        // Apply coupon
        double discountAmount = 0;
        Long finalCouponId = null;

        if (couponId != null) {
            Optional<UserCoupon> ucOpt = userCouponRepository.findByIdAndUserId(couponId, userId);
            if (ucOpt.isPresent() && ucOpt.get().getIsUsed() == 0) {
                UserCoupon uc = ucOpt.get();
                Optional<Coupon> cOpt = couponRepository.findById(uc.getCouponId());
                if (cOpt.isPresent()) {
                    Coupon coupon = cOpt.get();
                    finalCouponId = coupon.getId();
                    if ("full_reduction".equals(coupon.getType())) {
                        if (totalPrice >= coupon.getMinAmount()) {
                            discountAmount = coupon.getValue();
                        }
                    } else if ("discount".equals(coupon.getType())) {
                        discountAmount = Math.round(totalPrice * (1 - coupon.getValue()) * 100.0) / 100.0;
                        if (discountAmount > 10) discountAmount = 10;
                    } else if ("free_item".equals(coupon.getType())) {
                        discountAmount = cartItems.stream()
                            .mapToDouble(Cart::getUnitPrice).min().orElse(0);
                    }
                }
            }
        }

        double payAmount = Math.max(0, Math.round((totalPrice - discountAmount) * 100.0) / 100.0);

        // Generate order number
        String orderNo = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%04d", new Random().nextInt(10000));

        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setStoreId(storeId);
        order.setOrderNo(orderNo);
        order.setStatus(0);
        order.setTotalPrice(totalPrice);
        order.setDiscountAmount(discountAmount);
        order.setPayAmount(payAmount);
        order.setCouponId(finalCouponId);
        order.setStoreName(store.getName());
        order.setRemark(remark != null ? remark : "");
        order = orderRepository.save(order);

        // Create order items
        Long finalOrderId = order.getId();
        for (Cart item : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrderId(finalOrderId);
            oi.setProductId(item.getProductId());
            oi.setProductName(item.getProductName());
            // Get product image
            productRepository.findById(item.getProductId()).ifPresent(p ->
                oi.setProductImage(p.getImage() != null ? p.getImage() : ""));
            oi.setSpecs(item.getSpecs());
            oi.setToppings(item.getToppings());
            oi.setQuantity(item.getQuantity());
            oi.setUnitPrice(item.getUnitPrice());
            oi.setTotalPrice(Math.round(item.getUnitPrice() * item.getQuantity() * 100.0) / 100.0);
            orderItemRepository.save(oi);
        }

        // Mark coupon as used
        if (couponId != null && finalCouponId != null) {
            userCouponRepository.findByIdAndUserId(couponId, userId).ifPresent(uc -> {
                uc.setIsUsed(1);
                uc.setOrderId(finalOrderId);
                uc.setUsedAt(LocalDateTime.now());
                userCouponRepository.save(uc);
            });
        }

        // Clear cart
        cartRepository.deleteByUserId(userId);

        // Update sales
        for (Cart item : cartItems) {
            productRepository.findById(item.getProductId()).ifPresent(p -> {
                p.setMonthlySales(p.getMonthlySales() + item.getQuantity());
                productRepository.save(p);
            });
        }

        // Add points
        userRepository.findById(userId).ifPresent(u -> {
            u.setPoints(u.getPoints() + (int) Math.floor(payAmount));
            userRepository.save(u);
        });

        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("items", orderItemRepository.findByOrderId(finalOrderId));
        return result;
    }

    public List<Map<String, Object>> getOrders(Long userId, Integer status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        } else {
            orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        return orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("user_id", order.getUserId());
            map.put("store_id", order.getStoreId());
            map.put("store_name", order.getStoreName());
            map.put("order_no", order.getOrderNo());
            map.put("status", order.getStatus());
            map.put("total_price", order.getTotalPrice());
            map.put("discount_amount", order.getDiscountAmount());
            map.put("pay_amount", order.getPayAmount());
            map.put("coupon_id", order.getCouponId());
            map.put("remark", order.getRemark());
            map.put("created_at", order.getCreatedAt());
            map.put("paid_at", order.getPaidAt());
            map.put("completed_at", order.getCompletedAt());
            map.put("items", orderItemRepository.findByOrderId(order.getId()));
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getOrderDetail(Long id, Long userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权查看");
        }
        Map<String, Object> result = new HashMap<>();
        result.put("id", order.getId());
        result.put("user_id", order.getUserId());
        result.put("store_id", order.getStoreId());
        result.put("store_name", order.getStoreName());
        result.put("order_no", order.getOrderNo());
        result.put("status", order.getStatus());
        result.put("total_price", order.getTotalPrice());
        result.put("discount_amount", order.getDiscountAmount());
        result.put("pay_amount", order.getPayAmount());
        result.put("coupon_id", order.getCouponId());
        result.put("remark", order.getRemark());
        result.put("created_at", order.getCreatedAt());
        result.put("paid_at", order.getPaidAt());
        result.put("completed_at", order.getCompletedAt());
        result.put("items", orderItemRepository.findByOrderId(order.getId()));
        return result;
    }

    @Transactional
    public void cancelOrder(Long id, Long userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }
        if (order.getStatus() > 1) {
            throw new RuntimeException("订单当前状态无法取消");
        }

        // Restore coupon
        if (order.getCouponId() != null) {
            List<UserCoupon> ucs = userCouponRepository.findByUserIdOrderByIsUsedAscReceivedAtDesc(userId);
            for (UserCoupon uc : ucs) {
                if (uc.getOrderId() != null && uc.getOrderId().equals(id)) {
                    uc.setIsUsed(0);
                    uc.setOrderId(null);
                    uc.setUsedAt(null);
                    userCouponRepository.save(uc);
                }
            }
        }

        order.setStatus(5);
        orderRepository.save(order);
    }

    @Transactional
    public void payOrder(Long id, Long userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }
        if (order.getStatus() != 0) {
            throw new RuntimeException("订单状态不允许支付");
        }
        order.setStatus(1);
        order.setPaidAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    @Transactional
    public void completeOrder(Long id, Long userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }
        order.setStatus(4);
        order.setCompletedAt(LocalDateTime.now());
        orderRepository.save(order);
    }
}
