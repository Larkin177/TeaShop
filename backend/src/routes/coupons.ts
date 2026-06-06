import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

// GET /api/coupons/available - List available coupons user can claim
router.get('/available', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const coupons = db.prepare(`
      SELECT c.* FROM coupons c 
      WHERE c.status = 1 
        AND c.used_count < c.total_count 
        AND (c.end_time IS NULL OR c.end_time >= datetime('now'))
        AND c.id NOT IN (
          SELECT uc.coupon_id FROM user_coupons uc 
          WHERE uc.user_id = ? AND uc.coupon_id = c.id
        )
    `).all(req.user!.id);
    res.json({ code: 200, data: coupons });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// POST /api/coupons/:id/claim - Claim a coupon
router.post('/:id/claim', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const couponId = req.params.id;

    const coupon = db.prepare('SELECT * FROM coupons WHERE id = ? AND status = 1').get(couponId) as any;
    if (!coupon) {
      res.status(404).json({ code: 404, message: '优惠券不存在' });
      return;
    }

    if (coupon.used_count >= coupon.total_count) {
      res.status(400).json({ code: 400, message: '优惠券已领完' });
      return;
    }

    // Check if already claimed
    const existing = db.prepare(
      'SELECT id FROM user_coupons WHERE user_id = ? AND coupon_id = ?'
    ).get(req.user!.id, couponId);

    if (existing) {
      res.status(400).json({ code: 400, message: '您已领取过该优惠券' });
      return;
    }

    // Claim in transaction
    db.transaction(() => {
      db.prepare('INSERT INTO user_coupons (user_id, coupon_id) VALUES (?, ?)').run(req.user!.id, couponId);
      db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?').run(couponId);
    })();

    res.json({ code: 200, message: '领取成功' });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/coupons/my - List user's coupons
router.get('/my', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const userCoupons = db.prepare(`
      SELECT uc.*, c.name, c.type, c.value, c.min_amount, c.start_time, c.end_time, c.description
      FROM user_coupons uc
      JOIN coupons c ON uc.coupon_id = c.id
      WHERE uc.user_id = ?
      ORDER BY uc.is_used ASC, uc.received_at DESC
    `).all(req.user!.id);
    res.json({ code: 200, data: userCoupons });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
