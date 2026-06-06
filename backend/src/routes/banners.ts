import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { AuthRequest } from '../types';

const router = Router();

// GET /api/banners - List active banners
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const banners = db.prepare('SELECT * FROM banners WHERE status = 1 ORDER BY sort_order ASC').all();
    res.json({ code: 200, data: banners });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
