package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column(columnDefinition = "varchar(255) default ''")
    private String image = "";

    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @Column(columnDefinition = "int default 1")
    private Integer status = 1;

    @Column(name = "is_recommended", columnDefinition = "int default 0")
    private Integer isRecommended = 0;

    @Column(name = "monthly_sales", columnDefinition = "int default 0")
    private Integer monthlySales = 0;
}
