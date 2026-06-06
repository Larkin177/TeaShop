package com.teashop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(name = "wx_openid", unique = true, length = 64)
    private String wxOpenId;

    @Column(nullable = false, length = 50)
    private String nickname = "茶友";

    @Column(length = 255)
    private String avatar = "";

    @Column(columnDefinition = "int default 0")
    private Integer points = 0;

    @Column(name = "membership_level", columnDefinition = "int default 1")
    private Integer membershipLevel = 1;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
