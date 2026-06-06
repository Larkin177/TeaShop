package com.teashop.repository;

import com.teashop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByWxOpenId(String wxOpenId);
    boolean existsByPhone(String phone);
    boolean existsByWxOpenId(String wxOpenId);
}
