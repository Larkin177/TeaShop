package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_image", columnDefinition = "varchar(255) default ''")
    private String productImage = "";

    @Column(columnDefinition = "text")
    private String specs;

    @Column(columnDefinition = "text")
    private String toppings;

    @Column(columnDefinition = "int default 1")
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;
}
