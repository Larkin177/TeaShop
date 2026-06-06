package com.teashop.repository;

import com.teashop.entity.SpecOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpecOptionRepository extends JpaRepository<SpecOption, Long> {
    List<SpecOption> findByGroupIdOrderBySortOrderAsc(Long groupId);
    List<SpecOption> findByIdIn(List<Long> ids);
}
