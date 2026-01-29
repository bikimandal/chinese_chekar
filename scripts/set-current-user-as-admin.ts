/**
 * Script to set current user as ADMIN
 * Run with: npx tsx scripts/set-current-user-as-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

async function main() {
  try {
    console.log("🔍 Finding users in database...\n");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (users.length === 0) {
      console.log("❌ No users found in database.");
      console.log("   Please create a user first through Supabase Auth.");
      process.exit(1);
    }

    console.log("📋 Found users:");
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (Role: ${user.role})`);
    });

    // Update all users to ADMIN (or you can specify which one)
    console.log("\n🔄 Setting all users to ADMIN role...");
    
    const result = await prisma.user.updateMany({
      data: {
        role: "ADMIN",
      },
    });

    console.log(`✅ Updated ${result.count} user(s) to ADMIN role.\n`);

    console.log("📝 Next steps:");
    console.log("   1. Restart your development server");
    console.log("   2. Log in and you should have admin access");
    console.log("   3. Go to /admin/users to create more users");

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
