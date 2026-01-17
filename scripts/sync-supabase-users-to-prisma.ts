/**
 * Script to sync Supabase Auth users to Prisma User table
 * Run with: npx tsx scripts/sync-supabase-users-to-prisma.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are not set.");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  try {
    console.log("🔍 Fetching users from Supabase Auth...\n");

    // Get all users from Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      throw new Error(`Failed to fetch users from Supabase: ${authError.message}`);
    }

    if (!authUsers || authUsers.users.length === 0) {
      console.log("❌ No users found in Supabase Auth.");
      console.log("   Please create a user first by logging in.");
      process.exit(1);
    }

    console.log(`📋 Found ${authUsers.users.length} user(s) in Supabase Auth:\n`);

    for (const authUser of authUsers.users) {
      const email = authUser.email;
      if (!email) continue;

      console.log(`   - ${email}`);

      // Check if user exists in Prisma
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`     ✅ Already exists in database (Role: ${existingUser.role})`);
        
        // Update role to ADMIN if not already
        if (existingUser.role !== "ADMIN") {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { role: "ADMIN" },
          });
          console.log(`     🔄 Updated role to ADMIN`);
        }
      } else {
        // Create user in Prisma
        // Use a placeholder password (actual auth is via Supabase)
        const placeholderPassword = "supabase_auth_only_" + Math.random().toString(36);
        
        const newUser = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            password: placeholderPassword, // Placeholder, actual auth is via Supabase
            role: "ADMIN", // Set as ADMIN by default
            name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || null,
          },
        });
        console.log(`     ✅ Created in database (Role: ADMIN)`);
      }
    }

    console.log("\n✅ Sync completed!");
    console.log("\n📝 All users have been set to ADMIN role.");
    console.log("   You can change roles later via /admin/users page.\n");

  } catch (error) {
    console.error("\n❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
