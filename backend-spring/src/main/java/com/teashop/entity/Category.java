package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "sort_order", columnDefinition = "int default 0")
    private Integer sortOrder = 0;

    @Column(columnDefinition = "varchar(50) default ''")
    private String icon = "";
}
