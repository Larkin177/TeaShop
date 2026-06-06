package com.teashop.repository;

import com.teashop.entity.SpecGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpecGroupRepository extends JpaRepository<SpecGroup, Long> {
    List<SpecGroup> findByProductIdOrderBySortOrderAsc(Long productId);
}
