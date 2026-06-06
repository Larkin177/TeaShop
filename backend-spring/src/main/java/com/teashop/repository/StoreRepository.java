package com.teashop.repository;

import com.teashop.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {
    List<Store> findByStatus(Integer status);
}
