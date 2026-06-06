import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { AuthRequest } from '../types';

const router = Router();

// GET /api/stores - List all active stores
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const stores = db.prepare('SELECT * FROM stores WHERE status = 1').all();
    res.json({ code: 200, data: stores });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/stores/:id - Get store detail
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(req.params.id);
    if (!store) {
      res.status(404).json({ code: 404, message: '门店不存在' });
      return;
    }
    res.json({ code: 200, data: store });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
