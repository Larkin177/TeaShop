package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "spec_groups")
public class SpecGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "group_name", nullable = false)
    private String groupName;

    @Column(name = "group_type", nullable = false)
    private String groupType;

    @Column(name = "is_required", columnDefinition = "int default 1")
    private Integer isRequired = 1;

    @Column(name = "sort_order", columnDefinition = "int default 0")
    private Integer sortOrder = 0;
}
