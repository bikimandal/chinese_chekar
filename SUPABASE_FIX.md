# Fix: Supabase Connection Pooling Error

## Problem

When running `npx prisma db push` with Supabase connection pooling, you get:
```
ERROR: prepared statement "s1" already exists
```

This happens because Prisma migrations use prepared statements, which don't work with Supabase's connection pooling (pgbouncer).

## Solution

You need **two connection strings**:

1. **Direct Connection** (for migrations): Use for `prisma db push` and migrations
2. **Pooling Connection** (for runtime): Use in your app for better performance

### Step 1: Get Both Connection Strings from Supabase

1. Go to Supabase Dashboard → Settings → Database
2. **Direct Connection**: Use the connection string that starts with `db.` (port 5432)
   - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
3. **Pooling Connection**: Use the connection string with `pooler` (port 6543)
   - Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

### Step 2: Update Your `.env` File

```env
# Direct connection (for migrations - db push, migrate, etc.)
DATABASE_URL_DIRECT="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Pooling connection (for runtime - your Next.js app)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Step 3: Run Migrations

Now you can run:

```bash
# This will use DATABASE_URL_DIRECT for migrations
npm run db:push
```

### Alternative: Temporary Fix

If you don't want to set up two URLs, you can temporarily switch to direct connection:

1. In your `.env`, change `DATABASE_URL` to use the direct connection (without pooling)
2. Run `npm run db:push`
3. Change it back to pooling connection for runtime

## Why Two Connections?

- **Direct Connection**: Required for Prisma migrations (uses prepared statements)
- **Pooling Connection**: Better for Next.js serverless functions (handles many connections efficiently)

The app will use `DATABASE_URL` (pooling) at runtime, but migrations will use `DATABASE_URL_DIRECT` (direct).

