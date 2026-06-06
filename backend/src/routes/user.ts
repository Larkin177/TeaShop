import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

// GET /api/user/info - Get user profile with stats
router.get('/info', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const user = db.prepare(
      'SELECT id, phone, nickname, avatar, points, membership_level, created_at FROM users WHERE id = ?'
    ).get(req.user!.id) as any;

    if (!user) {
      res.status(404).json({ code: 404, message: '用户不存在' });
      return;
    }

    // Order stats
    const orderCount = db.prepare(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?'
    ).get(req.user!.id) as any;

    const completedOrders = db.prepare(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND status = 4'
    ).get(req.user!.id) as any;

    // Coupon stats
    const couponCount = db.prepare(
      'SELECT COUNT(*) as count FROM user_coupons WHERE user_id = ? AND is_used = 0'
    ).get(req.user!.id) as any;

    res.json({
      code: 200,
      data: {
        ...user,
        order_count: orderCount.count,
        completed_orders: completedOrders.count,
        coupon_count: couponCount.count
      }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/user/addresses - List addresses
router.get('/addresses', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const addresses = db.prepare(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC'
    ).all(req.user!.id);
    res.json({ code: 200, data: addresses });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// POST /api/user/addresses - Add address
router.post('/addresses', (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address, detail, is_default } = req.body;

    if (!name || !phone || !address) {
      res.status(400).json({ code: 400, message: '姓名、手机号和地址不能为空' });
      return;
    }

    const db = getDatabase();

    // If setting as default, unset other defaults
    if (is_default) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user!.id);
    }

    const result = db.prepare(
      'INSERT INTO addresses (user_id, name, phone, address, detail, is_default) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(req.user!.id, name, phone, address, detail || '', is_default ? 1 : 0);

    const newAddress = db.prepare('SELECT * FROM addresses WHERE id = ?').get(result.lastInsertRowid);
    res.json({ code: 200, message: '添加成功', data: newAddress });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// PUT /api/user/addresses/:id - Update address
router.put('/addresses/:id', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id);

    if (!existing) {
      res.status(404).json({ code: 404, message: '地址不存在' });
      return;
    }

    const { name, phone, address, detail, is_default } = req.body;

    // If setting as default, unset other defaults
    if (is_default) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user!.id);
    }

    db.prepare(
      'UPDATE addresses SET name = ?, phone = ?, address = ?, detail = ?, is_default = ? WHERE id = ? AND user_id = ?'
    ).run(
      name || (existing as any).name,
      phone || (existing as any).phone,
      address || (existing as any).address,
      detail !== undefined ? detail : (existing as any).detail,
      is_default ? 1 : 0,
      req.params.id,
      req.user!.id
    );

    const updated = db.prepare('SELECT * FROM addresses WHERE id = ?').get(req.params.id);
    res.json({ code: 200, message: '更新成功', data: updated });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// DELETE /api/user/addresses/:id - Delete address
router.delete('/addresses/:id', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id);

    if (!existing) {
      res.status(404).json({ code: 404, message: '地址不存在' });
      return;
    }

    db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
