import { Router, Response } from 'express';
import { getDatabase } from '../database/init';
import { AuthRequest } from '../types';

const router = Router();

// GET /api/categories - List all categories
router.get('/categories', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    res.json({ code: 200, data: categories });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/products/recommended - Get recommended products
router.get('/recommended', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const products = db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_recommended = 1 AND p.status = 1
      ORDER BY p.monthly_sales DESC
    `).all();
    res.json({ code: 200, data: products });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/products - List products with optional filters
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const { category_id, keyword } = req.query;

    let sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 1
    `;
    const params: any[] = [];

    if (category_id) {
      sql += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (keyword) {
      sql += ' AND p.name LIKE ?';
      params.push(`%${keyword}%`);
    }

    sql += ' ORDER BY p.monthly_sales DESC';

    const products = db.prepare(sql).all(...params);
    res.json({ code: 200, data: products });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

// GET /api/products/:id - Get product detail with specs and toppings
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const product = db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `).get(req.params.id) as any;

    if (!product) {
      res.status(404).json({ code: 404, message: '商品不存在' });
      return;
    }

    // Get spec groups with options
    const specGroups = db.prepare(
      'SELECT * FROM spec_groups WHERE product_id = ? ORDER BY sort_order ASC'
    ).all(product.id) as any[];

    for (const group of specGroups) {
      group.options = db.prepare(
        'SELECT * FROM spec_options WHERE group_id = ? ORDER BY sort_order ASC'
      ).all(group.id);
    }

    // Get available toppings
    const toppings = db.prepare(`
      SELECT t.* FROM toppings t 
      INNER JOIN product_toppings pt ON t.id = pt.topping_id 
      WHERE pt.product_id = ? AND t.status = 1
    `).all(product.id);

    res.json({
      code: 200,
      data: {
        ...product,
        spec_groups: specGroups,
        toppings
      }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: '服务器错误: ' + error.message });
  }
});

export default router;
