package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Double value;

    @Column(name = "min_amount", columnDefinition = "double default 0")
    private Double minAmount = 0.0;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "total_count", columnDefinition = "int default 100")
    private Integer totalCount = 100;

    @Column(name = "used_count", columnDefinition = "int default 0")
    private Integer usedCount = 0;

    @Column(columnDefinition = "int default 1")
    private Integer status = 1;

    @Column(columnDefinition = "text")
    private String description;
}
