package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "stores")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private Double latitude;
    private Double longitude;
    private String phone;

    @Column(name = "business_hours", columnDefinition = "varchar(50) default '09:00-22:00'")
    private String businessHours = "09:00-22:00";

    @Column(columnDefinition = "int default 1")
    private Integer status = 1;

    @Column(columnDefinition = "varchar(255) default ''")
    private String image = "";
}
