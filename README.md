# 古茗奶茶点单系统

一个仿古茗奶茶的全栈点单系统，前后端分离架构。

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS 样式框架
- Zustand 状态管理
- React Router v6 路由

### 后端
- Node.js + Express + TypeScript
- better-sqlite3 数据库
- JWT 认证
- bcryptjs 密码加密

## 功能特性

- 🏠 首页：轮播图、门店选择、推荐商品、优惠券
- 🍵 菜单：分类浏览、商品搜索、商品详情定制（糖度/冰度/加料）
- 🛒 购物车：增删改查、优惠券使用、备注
- 📋 订单：下单、模拟支付、订单状态跟踪
- 👤 个人中心：会员信息、积分、优惠券、收货地址
- 🏪 门店选择：多门店切换

## 快速开始

### 启动后端
```bash
cd backend
npm install
npm run dev
```
后端运行在 http://localhost:3001

### 启动前端
```bash
cd frontend
npm install
npm run dev
```
前端运行在 http://localhost:5173

### 测试账号
- 手机号：13800138000
- 密码：123456

## 项目结构

```
TeaShop/
├── backend/             # 后端 API
│   ├── src/
│   │   ├── index.ts     # 入口
│   │   ├── database/    # 数据库初始化和种子数据
│   │   ├── middleware/   # JWT 认证中间件
│   │   ├── routes/      # API 路由
│   │   └── types/       # TypeScript 类型
│   └── package.json
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── api/         # API 调用
│   │   ├── components/  # 通用组件
│   │   ├── pages/       # 页面组件
│   │   ├── store/       # Zustand 状态管理
│   │   └── types/       # TypeScript 类型
│   └── package.json
└── README.md
```