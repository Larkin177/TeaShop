package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "toppings")
public class Topping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(columnDefinition = "varchar(255) default ''")
    private String image = "";

    @Column(columnDefinition = "int default 1")
    private Integer status = 1;

    @Column(columnDefinition = "varchar(50) default 'topping'")
    private String category = "topping";
}
