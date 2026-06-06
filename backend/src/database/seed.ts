import { getDatabase } from './init';
import bcrypt from 'bcryptjs';

export function seedDatabase(): void {
  const db = getDatabase();

  const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get('13800138000');
  if (existingUser) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database with initial data...');

  const seedAll = db.transaction(() => {
    const insertCategory = db.prepare('INSERT INTO categories (name, sort_order, icon) VALUES (?, ?, ?)');
    insertCategory.run('当季限定', 1, '🌸');
    insertCategory.run('超人气', 2, '🔥');
    insertCategory.run('招牌必喝', 3, '👑');
    insertCategory.run('奶茶', 4, '🧋');
    insertCategory.run('果茶', 5, '🍹');
    insertCategory.run('咖啡', 6, '☕');
    insertCategory.run('小料', 7, '🥣');

    const insertTopping = db.prepare('INSERT INTO toppings (name, price, image, status, category) VALUES (?, ?, ?, 1, ?)');
    insertTopping.run('珍珠', 2, '', 'topping');
    insertTopping.run('椰果', 2, '', 'topping');
    insertTopping.run('芋圆', 3, '', 'topping');
    insertTopping.run('布丁', 3, '', 'topping');
    insertTopping.run('红豆', 2, '', 'topping');
    insertTopping.run('芋泥', 3, '', 'topping');
    insertTopping.run('西米', 2, '', 'topping');
    insertTopping.run('芝士', 4, '', 'topping');
    insertTopping.run('奶冻', 3, '', 'topping');

    const insertProduct = db.prepare(
      'INSERT INTO products (category_id, name, description, image, base_price, status, is_recommended, monthly_sales) VALUES (?, ?, ?, ?, ?, 1, ?, ?)'
    );

    insertProduct.run(1, '杨枝甘露', '芒果+西柚+椰奶的经典组合', '', 18, 1, 2580);
    insertProduct.run(1, '芒芒甘露', '新鲜芒果搭配椰浆，浓郁香甜', '', 18, 1, 2200);
    insertProduct.run(1, '多肉葡萄', '整颗葡萄手剥，果肉满溢', '', 19, 1, 3100);
    insertProduct.run(1, '满杯橙意', '满满一杯鲜橙，维C满满', '', 16, 1, 1800);

    insertProduct.run(2, '芋泥啵啵奶茶', '香浓芋泥搭配Q弹啵啵', '', 16, 1, 4200);
    insertProduct.run(2, '黑糖珍珠奶茶', '手炒黑糖+鲜牛奶+珍珠', '', 15, 1, 3800);
    insertProduct.run(2, '芋圆奶茶', '手工芋圆，软糯Q弹', '', 14, 1, 2900);
    insertProduct.run(2, '布丁奶茶', '嫩滑布丁+醇香奶茶', '', 14, 1, 2600);

    insertProduct.run(3, '古茗奶茶', '经典招牌，甘香丝滑', '', 12, 1, 5200);
    insertProduct.run(3, '古茗奶绿', '清新茶底+香浓奶味', '', 12, 1, 3500);
    insertProduct.run(3, '茉莉奶绿', '茉莉花香与绿茶的完美融合', '', 13, 1, 2800);
    insertProduct.run(3, '四季春奶茶', '四季春茶底，清爽解腻', '', 13, 1, 2400);

    insertProduct.run(4, '珍珠奶茶', '经典珍珠奶茶', '', 12, 0, 3200);
    insertProduct.run(4, '椰椰奶茶', '椰浆+奶茶，热带风情', '', 13, 0, 1900);
    insertProduct.run(4, '红豆奶茶', '绵密红豆+醇香奶茶', '', 13, 0, 1700);
    insertProduct.run(4, '花生奶茶', '香脆花生碎+奶茶', '', 13, 0, 1500);

    insertProduct.run(5, '柠檬绿茶', '新鲜柠檬+清爽绿茶', '', 12, 0, 2100);
    insertProduct.run(5, '百香果双响炮', '百香果+椰果+珍珠', '', 14, 1, 2700);
    insertProduct.run(5, '西瓜啵啵', '鲜榨西瓜+Q弹啵啵', '', 13, 0, 1600);
    insertProduct.run(5, '葡萄柚绿茶', '葡萄柚果肉+绿茶', '', 15, 0, 1400);
    insertProduct.run(5, '满杯柠檬', '整杯柠檬，酸甜解渴', '', 13, 0, 1800);

    insertProduct.run(6, '生椰拿铁', '新鲜椰浆+意式浓缩', '', 16, 0, 2300);
    insertProduct.run(6, '椰椰美式', '椰浆+美式咖啡', '', 14, 0, 1100);

    const insertSpecGroup = db.prepare(
      'INSERT INTO spec_groups (product_id, group_name, group_type, is_required, sort_order) VALUES (?, ?, ?, 1, ?)'
    );
    const insertSpecOption = db.prepare(
      'INSERT INTO spec_options (group_id, name, extra_price, is_default, sort_order) VALUES (?, ?, 0, ?, ?)'
    );

    const products = db.prepare('SELECT id FROM products').all() as { id: number }[];
    for (const product of products) {
      const sugarGroup = insertSpecGroup.run(product.id, '糖度', 'sugar', 1);
      const sugarGroupId = sugarGroup.lastInsertRowid;
      insertSpecOption.run(sugarGroupId, '正常糖', 1, 1);
      insertSpecOption.run(sugarGroupId, '少糖', 0, 0);
      insertSpecOption.run(sugarGroupId, '半糖', 0, 0);
      insertSpecOption.run(sugarGroupId, '微糖', 0, 0);
      insertSpecOption.run(sugarGroupId, '无糖', 0, 0);

      const iceGroup = insertSpecGroup.run(product.id, '冰度', 'ice', 2);
      const iceGroupId = iceGroup.lastInsertRowid;
      insertSpecOption.run(iceGroupId, '正常冰', 1, 1);
      insertSpecOption.run(iceGroupId, '少冰', 0, 0);
      insertSpecOption.run(iceGroupId, '去冰', 0, 0);
      insertSpecOption.run(iceGroupId, '温热', 0, 0);
    }

    const insertProductTopping = db.prepare(
      'INSERT INTO product_toppings (product_id, topping_id) VALUES (?, ?)'
    );
    const allToppings = db.prepare('SELECT id FROM toppings').all() as { id: number }[];
    for (const product of products) {
      for (const topping of allToppings) {
        insertProductTopping.run(product.id, topping.id);
      }
    }

    const insertStore = db.prepare(
      'INSERT INTO stores (name, address, latitude, longitude, phone, business_hours, status, image) VALUES (?, ?, ?, ?, ?, ?, 1, ?)'
    );
    insertStore.run('古茗(武林广场店)', '杭州市下城区武林广场21号武林银泰B1层', 30.2741, 120.1686, '0571-88886001', '09:00-22:00', '');
    insertStore.run('古茗(西湖银泰店)', '杭州市西湖区延安路8号西湖银泰购物中心2楼', 30.2501, 120.1559, '0571-88886002', '09:00-22:00', '');
    insertStore.run('古茗(滨江宝龙店)', '杭州市滨江区滨盛路3867号宝龙城市广场1楼', 30.2076, 120.2115, '0571-88886003', '10:00-22:00', '');
    insertStore.run('古茗(萧山万象汇店)', '杭州市萧山区市心中路928号万象汇购物中心B1层', 30.1721, 120.2685, '0571-88886004', '09:30-21:30', '');
    insertStore.run('古茗(下沙金沙湖店)', '杭州市钱塘区金沙大道557号金沙湖天街购物中心2楼', 30.2905, 120.3388, '0571-88886005', '10:00-22:00', '');

    const insertBanner = db.prepare(
      'INSERT INTO banners (image, link, sort_order, status) VALUES (?, ?, ?, 1)'
    );
    insertBanner.run('夏季新品上市', '/products?category_id=1', 1);
    insertBanner.run('新会员专享优惠', '/coupon-center', 2);
    insertBanner.run('招牌必喝推荐', '/products?category_id=3', 3);

    const insertCoupon = db.prepare(
      'INSERT INTO coupons (name, type, value, min_amount, start_time, end_time, total_count, used_count, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)'
    );
    insertCoupon.run('新人满减券', 'full_reduction', 5, 20, '2024-01-01', '2025-12-31', 1000, 0, '满20元可用，减5元');
    insertCoupon.run('新人满减券', 'full_reduction', 8, 30, '2024-01-01', '2025-12-31', 1000, 0, '满30元可用，减8元');
    insertCoupon.run('新人折扣券', 'discount', 0.8, 0, '2024-01-01', '2025-12-31', 1000, 0, '全场8折，最高减10元');

    const hashedPassword = bcrypt.hashSync('123456', 10);
    const insertUser = db.prepare(
      'INSERT INTO users (phone, password, nickname, avatar, points, membership_level) VALUES (?, ?, ?, ?, ?, ?)'
    );
    insertUser.run('13800138000', hashedPassword, '茶小茗', '', 580, 2);

    const insertUserCoupon = db.prepare(
      'INSERT INTO user_coupons (user_id, coupon_id, is_used, received_at) VALUES (?, ?, 0, CURRENT_TIMESTAMP)'
    );
    insertUserCoupon.run(1, 1);
    insertUserCoupon.run(1, 2);

    console.log('Database seeded successfully!');
  });

  seedAll();
}
