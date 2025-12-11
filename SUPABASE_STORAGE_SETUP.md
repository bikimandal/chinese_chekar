# Supabase Storage Setup Guide

To enable image uploads, you need to create a storage bucket in Supabase.

## Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Create Storage Bucket**
   - Go to **Storage** in the left sidebar
   - Click **New bucket**
   - Bucket name: `product-images`
   - Make it **Public** (so images can be accessed via URL)
   - Click **Create bucket**

3. **Set Bucket Policies**

   **Option A: Use Service Role Key (Recommended for Server-Side Uploads)**
   - Get your Service Role Key from Supabase Dashboard → Settings → API
   - Add it to your `.env` file:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```
   - This allows server-side uploads without needing additional policies
   - ⚠️ **Important**: Never expose this key in client-side code!

   **Option B: Add Policy for Anon Uploads (If not using Service Role Key)**
   - Click on the `product-images` bucket
   - Go to **Policies** tab
   - Click **New policy** → **For full customization**
   - Policy name: "Allow anon uploads"
   - Allowed operation: INSERT
   - Target roles: anon
   - Policy definition:
     ```sql
     (bucket_id = 'product-images'::text)
     ```
   - Click **Review** → **Save policy**
   
   **Required: Public Read Policy**
   - Add a policy to allow public reads:
     - Policy name: "Allow public reads"
     - Allowed operation: SELECT
     - Target roles: anon, authenticated
     - Policy definition:
       ```sql
       (bucket_id = 'product-images'::text)
       ```

4. **Test the Upload**
   - After creating the bucket, try uploading an image in the Admin Controls page
   - The image should be uploaded and a public URL will be generated

## Notes:
- Images are stored in the `product-images` bucket
- File naming: `products/{timestamp}-{random}.{extension}`
- Max file size: 5MB
- Supported formats: All image types (JPG, PNG, GIF, WebP, etc.)

