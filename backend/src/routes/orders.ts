import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

// POST /api/orders - Create order from cart items
router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const { store_id, coupon_id, remark } = req.body;
    const db = getDatabase();

    if (!store_id) {
      res.status(400).json({ code: 400, message: '请选择门店' });
      return;
    }

    const store = db.prepare('SELECT * FROM stores WHERE id = ? AND status = 1').get(store_id) as any;
    if (!store) {
      res.status(400).json({ code: 400, message: '门店不存在或已关闭' });
      return;
    }

    // Get cart items
    const cartItems = db.prepare('SELECT * FROM cart WHERE user_id = ?').all(req.user!.id) as any[];
    if (cartItems.length === 0) {
      res.status(400).json({ code: 400, message: '购物车为空' });
      return;
    }

    const createOrder = db.transaction(() => {
      // Calculate totals
      let totalPrice = 0;
      for (const item of cartItems) {
        totalPrice += item.unit_price * item.quantity;
      }
      totalPrice = Math.round(totalPrice * 100) / 100;

      // Apply coupon
      let discountAmount = 0;
      let finalCouponId: number | null = null;

      if (coupon_id) {
        const userCoupon = db.prepare(
          'SELECT uc.*, c.* FROM user_coupons uc JOIN coupons c ON uc.coupon_id = c.id WHERE uc.id = ? AND uc.user_id = ? AND uc.is_used = 0'
        ).get(coupon_id, req.user!.id) as any;

        if (userCoupon) {
          finalCouponId = userCoupon.coupon_id;
          if (userCoupon.type === 'full_reduction') {
            if (totalPrice >= userCoupon.min_amount) {
              discountAmount = userCoupon.value;
            }
          } else if (userCoupon.type === 'discount') {
            discountAmount = Math.round(totalPrice * (1 - userCoupon.value) * 100) / 100;
            if (discountAmount > 10) {
              discountAmount = 10; // Max discount 10 yuan
            }
          } else if (userCoupon.type === 'free_item') {
            // For free item, find the cheapest item
            const prices = cartItems.map((i: any) => i.unit_price);
            discountAmount = Math.min(...prices);
          }
        }
      }

      const payAmount = Math.max(0, Math.round((totalPrice - discountAmount) * 100) / 100);

      // Generate order number
      const now = new Date();
      const orderNo = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      // Create order
      const orderResult = db.prepare(
        `INSERT INTO orders (user_id, store_id, order_no, status, total_price, discount_amount, pay_amount, coupon_id, store_name, remark) 
         VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`
      ).run(req.user!.id, store_id, orderNo, totalPrice, discountAmount, payAmount, finalCouponId, store.name, remark || '');

      const orderId = orderResult.lastInsertRowid;

      // Create order items
      const insertOrderItem = db.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, specs, toppings, quantity, unit_price, total_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      for (const item of cartItems) {
        const itemTotal = Math.round(item.unit_price * item.quantity * 100) / 100;
        // Get product image
        const product = db.prepare('SELECT image FROM products WHERE id = ?').get(item.product_id) as any;
        insertOrderItem.run(
          orderId, item.product_id, item.product_name,
          product?.image || '', item.specs, item.toppings,
          item.quantity, item.unit_price, itemTotal
        );
      }

      // Mark coupon as used
      if (coupon_id) {
        db.prepare('UPDATE user_coupons SET is_used = 1, order_id = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?').run(orderId, coupon_id);
      }

      // Clear cart
      db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user!.id);

      // Update monthly sales
      for (const item of cartItems) {
        db.prepare('UPDATE products SET monthly_sales = monthly_sales + ? WHERE id = ?').run(item.quantity, item.product_id);
      }

      // Add points (1 point per yuan spent)
      db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(Math.floor(payAmount), req.user!.id);

      // Get full order
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      const orderItemsResult = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

      return { order, items: orderItemsResult };
    });

    const result = createOrder();
    res.json({ code: 200, message: '下单成功', data: result });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/orders - List user's orders
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const { status } = req.query;

    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params: any[] = [req.user!.id];

    if (status !== undefined && status !== '') {
      sql += ' AND status = ?';
      params.push(Number(status));
    }

    sql += ' ORDER BY created_at DESC';

    const orders = db.prepare(sql).all(...params) as any[];

    // Attach items to each order
    for (const order of orders) {
      order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    }

    res.json({ code: 200, data: orders });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/orders/:id - Get order detail
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id) as any;

    if (!order) {
      res.status(404).json({ code: 404, message: '订单不存在' });
      return;
    }

    order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    res.json({ code: 200, data: order });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id) as any;

    if (!order) {
      res.status(404).json({ code: 404, message: '订单不存在' });
      return;
    }

    if (order.status > 1) {
      res.status(400).json({ code: 400, message: '订单当前状态无法取消' });
      return;
    }

    // Restore coupon if used
    if (order.coupon_id) {
      const userCoupon = db.prepare(
        'SELECT id FROM user_coupons WHERE order_id = ? AND user_id = ?'
      ).get(order.id, req.user!.id) as any;
      if (userCoupon) {
        db.prepare('UPDATE user_coupons SET is_used = 0, order_id = NULL, used_at = NULL WHERE id = ?').run(userCoupon.id);
      }
    }

    db.prepare('UPDATE orders SET status = 5 WHERE id = ?').run(req.params.id);
    res.json({ code: 200, message: '订单已取消' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// PUT /api/orders/:id/complete - Mark completed
router.put('/:id/complete', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id) as any;

    if (!order) {
      res.status(404).json({ code: 404, message: '订单不存在' });
      return;
    }

    db.prepare('UPDATE orders SET status = 4, completed_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);
    res.json({ code: 200, message: '订单已完成' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// PUT /api/orders/:id/pay - Simulate payment
router.put('/:id/pay', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id) as any;

    if (!order) {
      res.status(404).json({ code: 404, message: '订单不存在' });
      return;
    }

    if (order.status !== 0) {
      res.status(400).json({ code: 400, message: '订单状态不允许支付' });
      return;
    }

    db.prepare('UPDATE orders SET status = 1, paid_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    res.json({ code: 200, message: '支付成功', data: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
