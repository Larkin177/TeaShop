package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "store_id", nullable = false)
    private Long storeId;

    @Column(name = "order_no", unique = true, nullable = false)
    private String orderNo;

    @Column(columnDefinition = "int default 0")
    private Integer status = 0;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "discount_amount", columnDefinition = "double default 0")
    private Double discountAmount = 0.0;

    @Column(name = "pay_amount", nullable = false)
    private Double payAmount;

    @Column(name = "coupon_id")
    private Long couponId;

    @Column(name = "store_name", columnDefinition = "varchar(100) default ''")
    private String storeName = "";

    @Column(columnDefinition = "text")
    private String remark;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
