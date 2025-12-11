# Quick Environment Setup

## Your Supabase URL

The URL you found:

```
https://jyzbvsiuxlkxibsixdln.supabase.co
```

This is your **Supabase Project URL** - use it for `NEXT_PUBLIC_SUPABASE_URL`

## Complete Setup Steps

### 1. Get Your Supabase Anon Key

On the same page where you found the URL, you should also see:

- **anon/public key** - This is what you need for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (a long string)

### 2. Create `.env` File

In your project root (same folder as `package.json`), create a file named `.env` and add:

```env
# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://jyzbvsiuxlkxibsixdln.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="paste-your-anon-key-here"

# Database Connections (you should already have these)
DATABASE_URL="your-pooling-connection-string"
DIRECT_URL="your-direct-connection-string"
```

### 3. Where to Find the Anon Key

1. Go to Supabase Dashboard → Your Project
2. Go to **Settings** → **API**
3. Look for **"Project API keys"** section
4. Find **"anon"** or **"public"** key
5. Copy that entire key (it's a long string)

### 4. Restart Server

After creating/updating `.env`:

```bash
# Stop server (Ctrl+C)
npm run dev
```

## What is the RESTful Endpoint?

The description "RESTful endpoint for querying and managing your database" means:

- This URL is the base endpoint for your Supabase project
- It's used for API calls to Supabase services (Auth, Database, Storage, etc.)
- It's safe to use in client-side code (that's why it's `NEXT_PUBLIC_`)

## Security Note

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Safe to expose (public)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Safe to expose (has Row Level Security protection)
- ❌ Never expose service role keys or database passwords
