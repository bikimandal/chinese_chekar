# Supabase Authentication Setup Guide

## 🔐 Environment Variables

Add these to your `.env` file:

```env
# Supabase Project URL (found in Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"

# Supabase Anon Key (found in Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Database URLs (you already have these)
DATABASE_URL="your-pooling-connection-string"
DIRECT_URL="your-direct-connection-string"
```

## 📝 Steps to Set Up Authentication

### 1. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Create Admin User in Supabase

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: Your admin email (e.g., `admin@chinesechekar.com`)
   - **Password**: A strong password
   - **Auto Confirm User**: ✅ (check this)
4. Click **"Create user"**

### 3. (Optional) Set Up Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed
4. For development, you can use Supabase's built-in email service

### 4. Test the Authentication

1. Start your dev server: `npm run dev`
2. Go to `/admin`
3. Login with the email and password you created in Supabase
4. You should be authenticated and see the dashboard

## 🔒 How It Works

### Authentication Flow

1. **Login**: User enters email/password → API calls Supabase Auth → Tokens saved in HTTP-only cookies
2. **Session Check**: On page load, checks for valid session token in cookies
3. **Logout**: Clears cookies and signs out from Supabase

### Security Features

- ✅ **HTTP-only cookies** - Tokens can't be accessed via JavaScript (XSS protection)
- ✅ **Secure cookies** - HTTPS only in production
- ✅ **SameSite protection** - CSRF protection
- ✅ **Token expiration** - Access token expires after 7 days, refresh token after 30 days
- ✅ **Server-side validation** - All auth checks happen on the server

## 📁 Files Created

- `src/lib/supabase.ts` - Server-side Supabase client with cookie storage
- `src/lib/supabase-client.ts` - Client-side Supabase client
- `src/app/api/auth/login/route.ts` - Login API endpoint
- `src/app/api/auth/logout/route.ts` - Logout API endpoint
- `src/app/api/auth/session/route.ts` - Session check API endpoint

## 🎯 Usage

### In Admin Page

The admin page now:
- Checks for valid session on load
- Redirects to login if not authenticated
- Uses Supabase authentication instead of localStorage
- Stores tokens securely in HTTP-only cookies

### Creating More Users

To add more admin users:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. They can now login to `/admin`

## 🚨 Troubleshooting

### "Invalid login credentials"
- Check that the user exists in Supabase Authentication
- Verify email and password are correct
- Make sure "Auto Confirm User" was checked when creating the user

### "Session not found"
- Check that cookies are enabled in your browser
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Check browser console for errors

### Tokens not persisting
- Ensure cookies are not being blocked
- Check that you're using HTTPS in production (required for secure cookies)

