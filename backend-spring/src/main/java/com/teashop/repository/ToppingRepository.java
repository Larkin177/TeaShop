package com.teashop.repository;

import com.teashop.entity.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ToppingRepository extends JpaRepository<Topping, Long> {
    List<Topping> findByStatus(Integer status);
}
