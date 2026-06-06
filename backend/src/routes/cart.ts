import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

// GET /api/cart - Get user's cart items
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const items = db.prepare(`
      SELECT c.*, p.image as product_image, p.status as product_status
      FROM cart c
      LEFT JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(req.user!.id);

    res.json({ code: 200, data: items });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// POST /api/cart - Add item to cart
router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const { product_id, specs, toppings, quantity } = req.body;
    const db = getDatabase();

    if (!product_id) {
      res.status(400).json({ code: 400, message: '商品ID不能为空' });
      return;
    }

    // Get product
    const product = db.prepare('SELECT * FROM products WHERE id = ? AND status = 1').get(product_id) as any;
    if (!product) {
      res.status(404).json({ code: 404, message: '商品不存在或已下架' });
      return;
    }

    // Calculate unit price
    let unitPrice = product.base_price;

    // Add spec extra prices
    if (specs && typeof specs === 'object') {
      const specOptionIds = Object.values(specs) as number[];
      if (specOptionIds.length > 0) {
        const placeholders = specOptionIds.map(() => '?').join(',');
        const specOptions = db.prepare(
          `SELECT extra_price FROM spec_options WHERE id IN (${placeholders})`
        ).all(...specOptionIds) as any[];
        for (const option of specOptions) {
          unitPrice += option.extra_price;
        }
      }
    }

    // Add topping prices
    let toppingIds: number[] = [];
    if (toppings && Array.isArray(toppings) && toppings.length > 0) {
      toppingIds = toppings;
      const placeholders = toppings.map(() => '?').join(',');
      const toppingPrices = db.prepare(
        `SELECT price FROM toppings WHERE id IN (${placeholders}) AND status = 1`
      ).all(...toppings) as any[];
      for (const tp of toppingPrices) {
        unitPrice += tp.price;
      }
    }

    const specsJson = typeof specs === 'string' ? specs : JSON.stringify(specs || {});
    const toppingsJson = JSON.stringify(toppingIds);

    // Check if same item already in cart (same product, specs, toppings)
    const existingItem = db.prepare(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND specs = ? AND toppings = ?'
    ).get(req.user!.id, product_id, specsJson, toppingsJson) as any;

    if (existingItem) {
      // Update quantity
      const newQty = existingItem.quantity + (quantity || 1);
      db.prepare('UPDATE cart SET quantity = ?, unit_price = ? WHERE id = ?').run(newQty, unitPrice, existingItem.id);
      const updated = db.prepare('SELECT * FROM cart WHERE id = ?').get(existingItem.id);
      res.json({ code: 200, message: '已更新购物车', data: updated });
    } else {
      const result = db.prepare(
        'INSERT INTO cart (user_id, product_id, product_name, specs, toppings, quantity, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(req.user!.id, product_id, product.name, specsJson, toppingsJson, quantity || 1, unitPrice);

      const newItem = db.prepare('SELECT * FROM cart WHERE id = ?').get(result.lastInsertRowid);
      res.json({ code: 200, message: '已加入购物车', data: newItem });
    }
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// PUT /api/cart/:id - Update quantity
router.put('/:id', (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const db = getDatabase();

    if (!quantity || quantity < 1) {
      res.status(400).json({ code: 400, message: '数量必须大于0' });
      return;
    }

    const item = db.prepare('SELECT * FROM cart WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id);
    if (!item) {
      res.status(404).json({ code: 404, message: '购物车商品不存在' });
      return;
    }

    db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
    const updated = db.prepare('SELECT * FROM cart WHERE id = ?').get(req.params.id);
    res.json({ code: 200, message: '更新成功', data: updated });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// DELETE /api/cart/:id - Remove item
router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare('SELECT * FROM cart WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id);
    if (!item) {
      res.status(404).json({ code: 404, message: '购物车商品不存在' });
      return;
    }

    db.prepare('DELETE FROM cart WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.id);
    res.json({ code: 200, message: '已移除' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user!.id);
    res.json({ code: 200, message: '购物车已清空' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
