import express from 'express';
import cors from 'cors';
import path from 'path';
import { initDatabase } from './database/init';
import { seedDatabase } from './database/seed';
import { getDatabase } from './database/init';

import authRoutes from './routes/auth';
import storeRoutes from './routes/stores';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import couponRoutes from './routes/coupons';
import userRoutes from './routes/user';
import bannerRoutes from './routes/banners';

const app = express();
const PORT = 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Standalone categories endpoint (frontend expects /api/categories)
app.get('/api/categories', (_req, res) => {
  try {
    const db = getDatabase();
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    res.json({ code: 200, data: categories });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/user', userRoutes);
app.use('/api/banners', bannerRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ code: 200, message: 'OK', timestamp: new Date().toISOString() });
});

async function start() {
  try {
    initDatabase();
    seedDatabase();
    console.log('Database ready');

    app.listen(PORT, () => {
      console.log(`TeaShop backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

start();
