import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/init';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';
import { generateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: AuthRequest, res: Response) => {
  try {
    const { phone, password, nickname } = req.body;

    if (!phone || !password) {
      res.status(400).json({ code: 400, message: '手机号和密码不能为空' });
      return;
    }

    if (!/^1\d{10}$/.test(phone)) {
      res.status(400).json({ code: 400, message: '手机号格式不正确' });
      return;
    }

    const db = getDatabase();
    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      res.status(400).json({ code: 400, message: '该手机号已注册' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (phone, password, nickname) VALUES (?, ?, ?)'
    ).run(phone, hashedPassword, nickname || '茶友');

    const userId = result.lastInsertRowid as number;
    const user = db.prepare(
      'SELECT id, phone, nickname, avatar, points, membership_level, created_at FROM users WHERE id = ?'
    ).get(userId) as any;

    const token = generateToken({ id: user.id, phone: user.phone, nickname: user.nickname });

    res.json({
      code: 200,
      message: '注册成功',
      data: { token, user }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', (req: AuthRequest, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ code: 400, message: '手机号和密码不能为空' });
      return;
    }

    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as any;

    if (!user) {
      res.status(400).json({ code: 400, message: '用户不存在' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(400).json({ code: 400, message: '密码错误' });
      return;
    }

    const token = generateToken({ id: user.id, phone: user.phone, nickname: user.nickname });
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      code: 200,
      message: '登录成功',
      data: { token, user: userWithoutPassword }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const user = db.prepare(
      'SELECT id, phone, nickname, avatar, points, membership_level, created_at FROM users WHERE id = ?'
    ).get(req.user!.id) as any;

    if (!user) {
      res.status(404).json({ code: 404, message: '用户不存在' });
      return;
    }

    res.json({ code: 200, data: user });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { nickname, avatar } = req.body;
    const db = getDatabase();

    const updates: string[] = [];
    const values: any[] = [];

    if (nickname !== undefined) {
      updates.push('nickname = ?');
      values.push(nickname);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar);
    }

    if (updates.length === 0) {
      res.status(400).json({ code: 400, message: '没有要更新的内容' });
      return;
    }

    values.push(req.user!.id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const user = db.prepare(
      'SELECT id, phone, nickname, avatar, points, membership_level, created_at FROM users WHERE id = ?'
    ).get(req.user!.id);

    res.json({ code: 200, message: '更新成功', data: user });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
