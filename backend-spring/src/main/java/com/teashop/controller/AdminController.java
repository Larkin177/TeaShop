package com.teashop.controller;

import com.teashop.dto.ApiResponse;
import com.teashop.entity.*;
import com.teashop.repository.*;
import com.teashop.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final BannerRepository bannerRepository;
    private final CouponRepository couponRepository;
    private final StoreRepository storeRepository;
    private final ToppingRepository toppingRepository;

    // ===== Dashboard =====
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalStores", storeRepository.count());
        
        // Revenue
        List<Order> paidOrders = orderRepository.findAll();
        double totalRevenue = paidOrders.stream()
            .filter(o -> o.getStatus() >= 1)
            .mapToDouble(o -> o.getPayAmount() != null ? o.getPayAmount() : 0)
            .sum();
        stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
        
        // Order status counts
        long pendingOrders = paidOrders.stream().filter(o -> o.getStatus() == 0).count();
        long paidOrdersCount = paidOrders.stream().filter(o -> o.getStatus() == 1).count();
        long completedOrders = paidOrders.stream().filter(o -> o.getStatus() == 4).count();
        stats.put("pendingOrders", pendingOrders);
        stats.put("paidOrders", paidOrdersCount);
        stats.put("completedOrders", completedOrders);
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ===== Products =====
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.success(productRepository.findAll()));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Map<String, Object> body) {
        Product p = new Product();
        p.setCategoryId(Long.valueOf(body.get("category_id").toString()));
        p.setName((String) body.get("name"));
        p.setDescription((String) body.get("description"));
        p.setImage((String) body.getOrDefault("image", ""));
        p.setBasePrice(Double.valueOf(body.get("base_price").toString()));
        p.setStatus(body.get("status") != null ? Integer.valueOf(body.get("status").toString()) : 1);
        p.setIsRecommended(body.get("is_recommended") != null ? Integer.valueOf(body.get("is_recommended").toString()) : 0);
        p.setMonthlySales(0);
        return ResponseEntity.ok(ApiResponse.success("Created", productRepository.save(p)));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (body.containsKey("name")) p.setName((String) body.get("name"));
        if (body.containsKey("description")) p.setDescription((String) body.get("description"));
        if (body.containsKey("image")) p.setImage((String) body.get("image"));
        if (body.containsKey("base_price")) p.setBasePrice(Double.valueOf(body.get("base_price").toString()));
        if (body.containsKey("category_id")) p.setCategoryId(Long.valueOf(body.get("category_id").toString()));
        if (body.containsKey("status")) p.setStatus(Integer.valueOf(body.get("status").toString()));
        if (body.containsKey("is_recommended")) p.setIsRecommended(Integer.valueOf(body.get("is_recommended").toString()));
        return ResponseEntity.ok(ApiResponse.success("Updated", productRepository.save(p)));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // ===== Categories =====
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findAll()));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Map<String, Object> body) {
        Category c = new Category();
        c.setName((String) body.get("name"));
        c.setIcon((String) body.getOrDefault("icon", ""));
        c.setSortOrder(body.get("sort_order") != null ? Integer.valueOf(body.get("sort_order").toString()) : 0);
        return ResponseEntity.ok(ApiResponse.success("Created", categoryRepository.save(c)));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Category c = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (body.containsKey("name")) c.setName((String) body.get("name"));
        if (body.containsKey("icon")) c.setIcon((String) body.get("icon"));
        if (body.containsKey("sort_order")) c.setSortOrder(Integer.valueOf(body.get("sort_order").toString()));
        return ResponseEntity.ok(ApiResponse.success("Updated", categoryRepository.save(c)));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // ===== Orders =====
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllOrders(
            @RequestParam(required = false) Integer status) {
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", order.getId());
            m.put("order_no", order.getOrderNo());
            m.put("user_id", order.getUserId());
            m.put("store_name", order.getStoreName());
            m.put("status", order.getStatus());
            m.put("total_price", order.getTotalPrice());
            m.put("discount_amount", order.getDiscountAmount());
            m.put("pay_amount", order.getPayAmount());
            m.put("remark", order.getRemark());
            m.put("created_at", order.getCreatedAt());
            m.put("paid_at", order.getPaidAt());
            m.put("completed_at", order.getCompletedAt());
            m.put("items", orderItemRepository.findByOrderId(order.getId()));
            // Get user info
            userRepository.findById(order.getUserId()).ifPresent(u -> {
                m.put("user_nickname", u.getNickname());
                m.put("user_phone", u.getPhone());
            });
            result.add(m);
        }
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        int newStatus = Integer.valueOf(body.get("status").toString());
        order.setStatus(newStatus);
        if (newStatus == 4) order.setCompletedAt(LocalDateTime.now());
        orderRepository.save(order);
        return ResponseEntity.ok(ApiResponse.success("Updated", null));
    }

    // ===== Users =====
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : users) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("phone", u.getPhone());
            m.put("nickname", u.getNickname());
            m.put("avatar", u.getAvatar());
            m.put("points", u.getPoints());
            m.put("membership_level", u.getMembershipLevel());
            m.put("created_at", u.getCreatedAt());
            result.add(m);
        }
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // ===== Banners =====
    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<List<Banner>>> getAllBanners() {
        return ResponseEntity.ok(ApiResponse.success(bannerRepository.findAll()));
    }

    @PostMapping("/banners")
    public ResponseEntity<ApiResponse<Banner>> createBanner(@RequestBody Map<String, Object> body) {
        Banner b = new Banner();
        b.setImage((String) body.get("image"));
        b.setLink((String) body.getOrDefault("link", ""));
        b.setSortOrder(body.get("sort_order") != null ? Integer.valueOf(body.get("sort_order").toString()) : 0);
        b.setStatus(body.get("status") != null ? Integer.valueOf(body.get("status").toString()) : 1);
        return ResponseEntity.ok(ApiResponse.success("Created", bannerRepository.save(b)));
    }

    @PutMapping("/banners/{id}")
    public ResponseEntity<ApiResponse<Banner>> updateBanner(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Banner b = bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (body.containsKey("image")) b.setImage((String) body.get("image"));
        if (body.containsKey("link")) b.setLink((String) body.get("link"));
        if (body.containsKey("sort_order")) b.setSortOrder(Integer.valueOf(body.get("sort_order").toString()));
        if (body.containsKey("status")) b.setStatus(Integer.valueOf(body.get("status").toString()));
        return ResponseEntity.ok(ApiResponse.success("Updated", bannerRepository.save(b)));
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(@PathVariable Long id) {
        bannerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // ===== Coupons =====
    @GetMapping("/coupons")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAllCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponRepository.findAll()));
    }

    @PostMapping("/coupons")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Map<String, Object> body) {
        Coupon c = new Coupon();
        c.setName((String) body.get("name"));
        c.setType((String) body.get("type"));
        c.setValue(Double.valueOf(body.get("value").toString()));
        c.setMinAmount(body.get("min_amount") != null ? Double.valueOf(body.get("min_amount").toString()) : 0.0);
        c.setDescription((String) body.getOrDefault("description", ""));
        c.setTotalCount(body.get("total_count") != null ? Integer.valueOf(body.get("total_count").toString()) : 100);
        c.setStartTime(LocalDateTime.now());
        c.setEndTime(LocalDateTime.now().plusDays(30));
        return ResponseEntity.ok(ApiResponse.success("Created", couponRepository.save(c)));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // ===== Stores =====
    @GetMapping("/stores")
    public ResponseEntity<ApiResponse<List<Store>>> getAllStores() {
        return ResponseEntity.ok(ApiResponse.success(storeRepository.findAll()));
    }

    @PostMapping("/stores")
    public ResponseEntity<ApiResponse<Store>> createStore(@RequestBody Map<String, Object> body) {
        Store s = new Store();
        s.setName((String) body.get("name"));
        s.setAddress((String) body.get("address"));
        s.setPhone((String) body.getOrDefault("phone", ""));
        s.setBusinessHours((String) body.getOrDefault("business_hours", "09:00-22:00"));
        s.setLatitude(body.get("latitude") != null ? Double.valueOf(body.get("latitude").toString()) : 0.0);
        s.setLongitude(body.get("longitude") != null ? Double.valueOf(body.get("longitude").toString()) : 0.0);
        return ResponseEntity.ok(ApiResponse.success("Created", storeRepository.save(s)));
    }

    @PutMapping("/stores/{id}")
    public ResponseEntity<ApiResponse<Store>> updateStore(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Store s = storeRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (body.containsKey("name")) s.setName((String) body.get("name"));
        if (body.containsKey("address")) s.setAddress((String) body.get("address"));
        if (body.containsKey("phone")) s.setPhone((String) body.get("phone"));
        if (body.containsKey("business_hours")) s.setBusinessHours((String) body.get("business_hours"));
        if (body.containsKey("status")) s.setStatus(Integer.valueOf(body.get("status").toString()));
        return ResponseEntity.ok(ApiResponse.success("Updated", storeRepository.save(s)));
    }

    @DeleteMapping("/stores/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStore(@PathVariable Long id) {
        storeRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // ===== Toppings =====
    @GetMapping("/toppings")
    public ResponseEntity<ApiResponse<List<Topping>>> getAllToppings() {
        return ResponseEntity.ok(ApiResponse.success(toppingRepository.findAll()));
    }
}
