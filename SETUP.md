# Chinese Chekar - Setup Guide

## 🚀 Quick Start

### 1. Database Setup

Make sure you have a PostgreSQL database and set the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chinese_chekar"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (optional)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── items/        # Item CRUD operations
│   │   └── categories/   # Category operations
│   ├── admin/            # Admin dashboard
│   ├── home/             # Public customer page
│   └── page.tsx          # Entry point
├── components/
│   ├── Header.tsx        # Site header
│   ├── Footer.tsx         # Site footer
│   └── ItemCard.tsx      # Item display card
└── lib/
    └── prisma.ts         # Prisma client instance
```

## 🔑 Admin Access

1. Navigate to `/admin`
2. Login with any email/password (authentication is basic for now)
3. You can add, edit, and delete items
4. Changes are reflected immediately on the public site

## ✨ Features Implemented

✅ Public customer-facing homepage
✅ Real-time stock display (updates every 5 seconds)
✅ Search functionality
✅ Category filtering
✅ Stock status indicators (Available/Low Stock/Out of Stock)
✅ Admin dashboard with login
✅ Item management (Add/Edit/Delete)
✅ Category management
✅ Responsive design

## 🎨 Stock Status Colors

- 🟢 **Available** - Stock > 5
- 🟡 **Low Stock** - Stock 1-5
- 🔴 **Out of Stock** - Stock = 0

## 📝 Next Steps

1. Implement proper authentication (JWT, NextAuth, etc.)
2. Add image upload functionality
3. Implement WebSockets for true real-time updates
4. Add analytics dashboard
5. Add order request functionality

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with sample data
