package com.teashop.service;

import com.teashop.entity.*;
import com.teashop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SpecGroupRepository specGroupRepository;
    private final SpecOptionRepository specOptionRepository;
    private final ToppingRepository toppingRepository;
    private final ProductToppingRepository productToppingRepository;

    public List<Map<String, Object>> getRecommendedProducts() {
        List<Product> products = productRepository.findByIsRecommendedAndStatus(1, 1);
        return products.stream().map(this::toProductMap).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getProducts(Long categoryId, String keyword) {
        List<Product> products;
        if (categoryId != null) {
            products = productRepository.findByCategoryIdAndStatusOrderByMonthlySalesDesc(categoryId, 1);
        } else if (keyword != null && !keyword.isEmpty()) {
            products = productRepository.findByNameContainingAndStatus(keyword, 1);
        } else {
            products = productRepository.findByStatusOrderByMonthlySalesDesc(1);
        }
        return products.stream().map(this::toProductMap).collect(Collectors.toList());
    }

    public Map<String, Object> getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("商品不存在"));

        Map<String, Object> result = toProductMap(product);

        // Get spec groups with options
        List<SpecGroup> groups = specGroupRepository.findByProductIdOrderBySortOrderAsc(id);
        List<Map<String, Object>> groupMaps = groups.stream().map(g -> {
            Map<String, Object> gm = new HashMap<>();
            gm.put("id", g.getId());
            gm.put("group_name", g.getGroupName());
            gm.put("group_type", g.getGroupType());
            gm.put("is_required", g.getIsRequired());
            gm.put("sort_order", g.getSortOrder());
            List<SpecOption> options = specOptionRepository.findByGroupIdOrderBySortOrderAsc(g.getId());
            gm.put("options", options.stream().map(o -> {
                Map<String, Object> om = new HashMap<>();
                om.put("id", o.getId());
                om.put("name", o.getName());
                om.put("extra_price", o.getExtraPrice());
                om.put("is_default", o.getIsDefault());
                om.put("sort_order", o.getSortOrder());
                return om;
            }).collect(Collectors.toList()));
            return gm;
        }).collect(Collectors.toList());

        // Get toppings
        List<ProductTopping> ptList = productToppingRepository.findByProductId(id);
        List<Long> toppingIds = ptList.stream().map(ProductTopping::getToppingId).collect(Collectors.toList());
        List<Topping> toppings = toppingRepository.findAllById(toppingIds).stream()
                .filter(t -> t.getStatus() == 1).collect(Collectors.toList());

        result.put("spec_groups", groupMaps);
        result.put("toppings", toppings.stream().map(t -> {
            Map<String, Object> tm = new HashMap<>();
            tm.put("id", t.getId());
            tm.put("name", t.getName());
            tm.put("price", t.getPrice());
            tm.put("image", t.getImage() != null ? t.getImage() : "");
            return tm;
        }).collect(Collectors.toList()));

        return result;
    }

    public List<Category> getCategories() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }

    private Map<String, Object> toProductMap(Product p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("category_id", p.getCategoryId());
        map.put("name", p.getName());
        map.put("description", p.getDescription() != null ? p.getDescription() : "");
        map.put("image", p.getImage() != null ? p.getImage() : "");
        map.put("base_price", p.getBasePrice());
        map.put("status", p.getStatus());
        map.put("is_recommended", p.getIsRecommended());
        map.put("monthly_sales", p.getMonthlySales());
        // Get category name
        categoryRepository.findById(p.getCategoryId()).ifPresent(c ->
            map.put("category_name", c.getName())
        );
        return map;
    }
}
