package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "spec_options")
public class SpecOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(nullable = false)
    private String name;

    @Column(name = "extra_price", columnDefinition = "double default 0")
    private Double extraPrice = 0.0;

    @Column(name = "is_default", columnDefinition = "int default 0")
    private Integer isDefault = 0;

    @Column(name = "sort_order", columnDefinition = "int default 0")
    private Integer sortOrder = 0;
}
