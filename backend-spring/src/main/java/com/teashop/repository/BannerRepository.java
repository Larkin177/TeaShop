package com.teashop.repository;

import com.teashop.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByStatusOrderBySortOrderAsc(Integer status);
}
