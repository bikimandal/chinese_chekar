import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "Supabase URL not configured" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase key not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create Supabase client
    // Use service role key for server-side uploads (bypasses RLS)
    // If not available, fall back to anon key (requires proper policies)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseKey) {
      return NextResponse.json(
        { error: "Supabase key not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      
      // Check if bucket doesn't exist
      if (error.message?.includes("Bucket not found") || error.message?.includes("not found")) {
        return NextResponse.json(
          { 
            error: "Storage bucket not found",
            details: "Please create a 'product-images' bucket in Supabase Storage. See SUPABASE_STORAGE_SETUP.md for instructions.",
            message: error.message
          },
          { status: 404 }
        );
      }
      
      // Check for permission errors
      if (error.message?.includes("permission") || error.message?.includes("policy")) {
        return NextResponse.json(
          { 
            error: "Permission denied",
            details: "Please check your Supabase Storage bucket policies. The bucket should be public or have proper policies set.",
            message: error.message
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Failed to upload image", 
          details: error.message,
          hint: "Make sure the 'product-images' bucket exists in Supabase Storage and is set to public."
        },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

