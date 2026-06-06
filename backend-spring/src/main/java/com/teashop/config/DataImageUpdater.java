package com.teashop.config;

import com.teashop.entity.*;
import com.teashop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@Order(2)
@RequiredArgsConstructor
public class DataImageUpdater implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final BannerRepository bannerRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("Checking images...");
        boolean updated = false;

        for (Product p : productRepository.findAll()) {
            if (p.getImage() == null || p.getImage().isEmpty()) {
                String color = getColor(p.getName());
                p.setImage("https://placehold.co/400x400/" + color + "/fff?text=" + p.getId());
                productRepository.save(p);
                updated = true;
            }
        }

        for (Banner b : bannerRepository.findAll()) {
            if (b.getImage() == null || b.getImage().isEmpty() || !b.getImage().startsWith("http")) {
                String[] colors = {"E74C3C", "3498DB", "2ECC71"};
                int idx = Math.max(0, Math.min(b.getSortOrder() - 1, 2));
                b.setImage("https://placehold.co/750x360/" + colors[idx] + "/fff?text=Banner" + b.getSortOrder());
                bannerRepository.save(b);
                updated = true;
            }
        }

        for (Category c : categoryRepository.findAll()) {
            if (c.getIcon() == null || c.getIcon().isEmpty() || c.getIcon().length() > 20) {
                String color = getColor(c.getName());
                c.setIcon("https://placehold.co/100x100/" + color + "/fff?text=" + c.getId());
                categoryRepository.save(c);
                updated = true;
            }
        }

        System.out.println(updated ? "Images updated!" : "All images OK.");
    }

    private String getColor(String name) {
        String[] colors = {"E74C3C","E67E22","F1C40F","8B4513","2ECC71","34495E","9B59B6","3498DB","1ABC9C","E91E63"};
        int idx = Math.abs(name.hashCode()) % colors.length;
        return colors[idx];
    }
}
