package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "banners")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500, nullable = false)
    private String image;

    @Column(columnDefinition = "varchar(255) default ''")
    private String link = "";

    @Column(name = "sort_order", columnDefinition = "int default 0")
    private Integer sortOrder = 0;

    @Column(columnDefinition = "int default 1")
    private Integer status = 1;
}
