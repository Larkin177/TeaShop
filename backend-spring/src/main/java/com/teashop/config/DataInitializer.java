package com.teashop.config;

import com.teashop.entity.*;
import com.teashop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SpecGroupRepository specGroupRepository;
    private final SpecOptionRepository specOptionRepository;
    private final ToppingRepository toppingRepository;
    private final ProductToppingRepository productToppingRepository;
    private final BannerRepository bannerRepository;
    private final CouponRepository couponRepository;
    private final UserCouponRepository userCouponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("Database already seeded, skipping...");
            return;
        }

        System.out.println("Seeding database with initial data...");

        // Categories
        createCategory("当季限定", 1, "限");
        createCategory("超人气", 2, "火");
        createCategory("招牌必喝", 3, "冠");
        createCategory("奶茶", 4, "奶");
        createCategory("果茶", 5, "果");
        createCategory("咖啡", 6, "咖");
        createCategory("小料", 7, "料");

        // Toppings
        createTopping("珍珠", 2.0, "topping");
        createTopping("椰果", 2.0, "topping");
        createTopping("芋圆", 3.0, "topping");
        createTopping("布丁", 3.0, "topping");
        createTopping("红豆", 2.0, "topping");
        createTopping("芋泥", 3.0, "topping");
        createTopping("西米", 2.0, "topping");
        createTopping("芝士", 4.0, "topping");
        createTopping("奶盖", 3.0, "topping");

        var allToppings = toppingRepository.findAll();

        // Products - Category 1 (当季限定)
        createProduct(1L, "杨枝甘露", "芒果+西柚+椰奶的经典组合", 18.0, 1, 2580);
        createProduct(1L, "芒芒甘露", "新鲜芒果搭配椰浆，浓郁香甜", 18.0, 1, 2200);
        createProduct(1L, "多肉葡萄", "整颗葡萄手剥，果肉满溢", 19.0, 1, 3100);
        createProduct(1L, "满杯橙意", "满满一杯鲜橙，维C满满", 16.0, 1, 1800);

        // Category 2 (超人气)
        createProduct(2L, "芋泥啵啵奶茶", "香浓芋泥搭配Q弹啵啵", 16.0, 1, 4200);
        createProduct(2L, "黑糖珍珠奶茶", "手炒黑糖+鲜牛奶+珍珠", 15.0, 1, 3800);
        createProduct(2L, "芋圆奶茶", "手工芋圆，软糯Q弹", 14.0, 1, 2900);
        createProduct(2L, "布丁奶茶", "嫩滑布丁+醇香奶茶", 14.0, 1, 2600);

        // Category 3 (招牌必喝)
        createProduct(3L, "古茗奶茶", "经典招牌，甘香丝滑", 12.0, 1, 5200);
        createProduct(3L, "古茗奶绿", "清新茶底+香浓奶味", 12.0, 1, 3500);
        createProduct(3L, "茉莉奶绿", "茉莉花香与绿茶的完美融合", 13.0, 1, 2800);
        createProduct(3L, "四季春奶茶", "四季春茶底，清爽解腻", 13.0, 1, 2400);

        // Category 4 (奶茶)
        createProduct(4L, "珍珠奶茶", "经典珍珠奶茶", 12.0, 0, 3200);
        createProduct(4L, "椰椰奶茶", "椰浆+奶茶，热带风情", 13.0, 0, 1900);
        createProduct(4L, "红豆奶茶", "绵密红豆+醇香奶茶", 13.0, 0, 1700);
        createProduct(4L, "花生奶茶", "香脆花生碎+奶茶", 13.0, 0, 1500);

        // Category 5 (果茶)
        createProduct(5L, "柠檬绿茶", "新鲜柠檬+清爽绿茶", 12.0, 0, 2100);
        createProduct(5L, "百香果双响炮", "百香果+椰果+珍珠", 14.0, 1, 2700);
        createProduct(5L, "西瓜啵啵", "鲜榨西瓜+Q弹啵啵", 13.0, 0, 1600);
        createProduct(5L, "葡萄柠绿", "葡萄果肉+绿茶", 15.0, 0, 1400);
        createProduct(5L, "满杯柠檬", "整杯柠檬，酸甜解渴", 13.0, 0, 1800);

        // Category 6 (咖啡)
        createProduct(6L, "生椰拿铁", "新鲜椰浆+意式浓缩", 16.0, 0, 2300);
        createProduct(6L, "椰椰美式", "椰浆+美式咖啡", 14.0, 0, 1100);

        var allProducts = productRepository.findAll();

        // Create specs for each product
        for (Product p : allProducts) {
            SpecGroup sugarGroup = new SpecGroup();
            sugarGroup.setProductId(p.getId());
            sugarGroup.setGroupName("糖度");
            sugarGroup.setGroupType("sugar");
            sugarGroup.setIsRequired(1);
            sugarGroup.setSortOrder(1);
            sugarGroup = specGroupRepository.save(sugarGroup);

            createSpecOption(sugarGroup.getId(), "正常糖", 0.0, 1, 1);
            createSpecOption(sugarGroup.getId(), "少糖", 0.0, 0, 0);
            createSpecOption(sugarGroup.getId(), "半糖", 0.0, 0, 0);
            createSpecOption(sugarGroup.getId(), "微糖", 0.0, 0, 0);
            createSpecOption(sugarGroup.getId(), "无糖", 0.0, 0, 0);

            SpecGroup iceGroup = new SpecGroup();
            iceGroup.setProductId(p.getId());
            iceGroup.setGroupName("冰度");
            iceGroup.setGroupType("ice");
            iceGroup.setIsRequired(1);
            iceGroup.setSortOrder(2);
            iceGroup = specGroupRepository.save(iceGroup);

            createSpecOption(iceGroup.getId(), "正常冰", 0.0, 1, 1);
            createSpecOption(iceGroup.getId(), "少冰", 0.0, 0, 0);
            createSpecOption(iceGroup.getId(), "去冰", 0.0, 0, 0);
            createSpecOption(iceGroup.getId(), "温/热", 0.0, 0, 0);
        }

        // Link all toppings to all products
        for (Product p : allProducts) {
            for (Topping t : allToppings) {
                ProductTopping pt = new ProductTopping();
                pt.setProductId(p.getId());
                pt.setToppingId(t.getId());
                productToppingRepository.save(pt);
            }
        }

        // Stores
        createStore("古茗(武林广场店)", "杭州市下城区武林广场21号武林银泰B1层",
                30.2741, 120.1686, "0571-88886001", "09:00-22:00");
        createStore("古茗(西湖银泰店)", "杭州市西湖区延安路8号西湖银泰购物中心2楼",
                30.2501, 120.1559, "0571-88886002", "09:00-22:00");
        createStore("古茗(滨江宝龙店)", "杭州市滨江区滨盛路3867号宝龙城市广场1楼",
                30.2076, 120.2115, "0571-88886003", "10:00-22:00");
        createStore("古茗(萧山万象汇店)", "杭州市萧山区市心中路928号万象汇购物中心B1层",
                30.1721, 120.2685, "0571-88886004", "09:30-21:30");
        createStore("古茗(下沙金沙湖店)", "杭州市钱塘区金沙大道557号金沙湖天街购物中心2楼",
                30.2905, 120.3388, "0571-88886005", "10:00-22:00");

        // Banners
        createBanner("夏日新品上市", "/products?category_id=1", 1);
        createBanner("新会员专享优惠", "/coupon-center", 2);
        createBanner("招牌必喝推荐", "/products?category_id=3", 3);

        // Coupons
        Coupon c1 = createCoupon("新人满减券", "full_reduction", 5.0, 20.0,
                "满20元可用，减5元");
        Coupon c2 = createCoupon("新人满减券", "full_reduction", 8.0, 30.0,
                "满30元可用，减8元");
        Coupon c3 = createCoupon("新人折扣券", "discount", 0.8, 0.0,
                "全场8折，最高减10元");

        // Test user
        User user = new User();
        user.setPhone("13800138000");
        user.setPassword(passwordEncoder.encode("123456"));
        user.setNickname("茶小茶");
        user.setPoints(580);
        user.setMembershipLevel(2);
        user = userRepository.save(user);

        // Give user coupons
        UserCoupon uc1 = new UserCoupon();
        uc1.setUserId(user.getId());
        uc1.setCouponId(c1.getId());
        userCouponRepository.save(uc1);

        UserCoupon uc2 = new UserCoupon();
        uc2.setUserId(user.getId());
        uc2.setCouponId(c2.getId());
        userCouponRepository.save(uc2);

        System.out.println("Database seeded successfully!");
    }

    private Category createCategory(String name, int sortOrder, String icon) {
        Category c = new Category();
        c.setName(name);
        c.setSortOrder(sortOrder);
        c.setIcon(icon);
        return categoryRepository.save(c);
    }

    private Topping createTopping(String name, double price, String category) {
        Topping t = new Topping();
        t.setName(name);
        t.setPrice(price);
        t.setCategory(category);
        return toppingRepository.save(t);
    }

    private Product createProduct(Long categoryId, String name, String desc, double price, int recommended, int sales) {
        Product p = new Product();
        p.setCategoryId(categoryId);
        p.setName(name);
        p.setDescription(desc);
        p.setBasePrice(price);
        p.setIsRecommended(recommended);
        p.setMonthlySales(sales);
        return productRepository.save(p);
    }

    private void createSpecOption(Long groupId, String name, double extraPrice, int isDefault, int sortOrder) {
        SpecOption o = new SpecOption();
        o.setGroupId(groupId);
        o.setName(name);
        o.setExtraPrice(extraPrice);
        o.setIsDefault(isDefault);
        o.setSortOrder(sortOrder);
        specOptionRepository.save(o);
    }

    private void createStore(String name, String address, double lat, double lng, String phone, String hours) {
        Store s = new Store();
        s.setName(name);
        s.setAddress(address);
        s.setLatitude(lat);
        s.setLongitude(lng);
        s.setPhone(phone);
        s.setBusinessHours(hours);
        storeRepository.save(s);
    }

    private void createBanner(String image, String link, int sortOrder) {
        Banner b = new Banner();
        b.setImage(image);
        b.setLink(link);
        b.setSortOrder(sortOrder);
        bannerRepository.save(b);
    }

    private Coupon createCoupon(String name, String type, double value, double minAmount, String desc) {
        Coupon c = new Coupon();
        c.setName(name);
        c.setType(type);
        c.setValue(value);
        c.setMinAmount(minAmount);
        c.setStartTime(LocalDateTime.of(2024, 1, 1, 0, 0));
        c.setEndTime(LocalDateTime.of(2025, 12, 31, 23, 59));
        c.setTotalCount(1000);
        c.setDescription(desc);
        return couponRepository.save(c);
    }
}
