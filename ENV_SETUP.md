# Environment Variables Setup

## ⚠️ IMPORTANT: Create `.env` File

**You need to create a `.env` file in the project root** (same folder as `package.json`).

Copy `.env.example` to `.env` and fill in your values:

```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# Or manually create .env file
```

## Required Environment Variables

Your `.env` file (in the project root) must contain all these variables:

```env
# Supabase Authentication
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Database Connections
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Troubleshooting "Internal Server Error"

### 1. Check Environment Variables

Make sure both Supabase variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Restart Dev Server

After adding/changing `.env` variables:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Check Server Logs

Look at your terminal/console for error messages. The improved error handling will now show:
- "Server configuration error: Supabase URL not configured"
- "Server configuration error: Supabase key not configured"
- Or the actual Supabase error message

### 4. Verify User Exists

Make sure you've created a user in Supabase:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Check "Auto Confirm User"
5. Click "Create user"

### 5. Test Connection

Try logging in with the credentials you created in Supabase.

