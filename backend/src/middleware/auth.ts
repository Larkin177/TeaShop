import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

const JWT_SECRET = 'teashop-secret-2024';

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ code: 401, message: '未登录，请先登录' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; phone: string; nickname: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ code: 401, message: '登录已过期，请重新登录' });
  }
}

export function optionalAuthMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; phone: string; nickname: string };
      req.user = decoded;
    }
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
}

export function generateToken(user: { id: number; phone: string; nickname: string }): string {
  return jwt.sign({ id: user.id, phone: user.phone, nickname: user.nickname }, JWT_SECRET, { expiresIn: '7d' });
}
