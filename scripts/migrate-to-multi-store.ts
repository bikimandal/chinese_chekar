/**
 * Migration Script: Add Multi-Store Support
 * 
 * ⚠️  IMPORTANT: Run Prisma migration FIRST before running this script!
 * 
 * Steps:
 * 1. npx prisma generate
 * 2. npx prisma migrate dev --name add_multi_store_support
 * 3. npx tsx scripts/migrate-to-multi-store.ts (this script)
 * 
 * This script:
 * 1. Creates a default "Chinese Chekar" store
 * 2. Assigns all existing data to the default store
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

// Ensure DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please check your .env file."
  );
}

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

async function main() {
  console.log("🚀 Starting multi-store migration...\n");

  try {
    // Step 0: Check if Store table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Store" LIMIT 1`;
    } catch (error: any) {
      if (error.code === "P2021" || error.message?.includes("does not exist")) {
        console.error("❌ Error: Store table does not exist in the database.");
        console.error("\n📝 Please run the Prisma migration first:");
        console.error("   1. npx prisma generate");
        console.error("   2. npx prisma migrate dev --name add_multi_store_support");
        console.error("   3. Then run this script again: npx tsx scripts/migrate-to-multi-store.ts\n");
        process.exit(1);
      }
      throw error;
    }

    // Step 1: Check if default store already exists
    const existingDefaultStore = await prisma.store.findFirst({
      where: { isDefault: true },
    });

    let defaultStoreId: string;

    if (existingDefaultStore) {
      console.log("✅ Default store already exists:", existingDefaultStore.name);
      defaultStoreId = existingDefaultStore.id;
    } else {
      // Step 2: Create default store
      console.log("📦 Creating default store 'Chinese Chekar'...");
      const defaultStore = await prisma.store.create({
        data: {
          name: "Chinese Chekar",
          slug: "chinese-chekar",
          isDefault: true,
          isActive: true,
        },
      });
      defaultStoreId = defaultStore.id;
      console.log("✅ Default store created:", defaultStore.id);
    }

    // Step 3: Check if migration has already been run (using raw SQL for nullable check)
    const itemsWithStoreResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM "Item" WHERE "storeId" IS NOT NULL
    `;
    const itemsWithStore = Number(itemsWithStoreResult[0].count);

    if (itemsWithStore > 0) {
      console.log("⚠️  Migration appears to have already been run.");
      console.log(`   Found ${itemsWithStore} items with storeId already set.`);
      console.log("   Skipping data migration...\n");
      
      // Still check if store status exists
      const existingStatus = await prisma.storeStatus.findUnique({
        where: { storeId: defaultStoreId },
      });

      if (!existingStatus) {
        console.log("🔄 Creating store status for default store...");
        await prisma.storeStatus.create({
          data: {
            storeId: defaultStoreId,
            isOpen: true,
          },
        });
        console.log("✅ Store status created");
      }

      console.log("\n✅ Migration check completed!");
      await prisma.$disconnect();
      return;
    }

    // Step 4: Count existing data (items without storeId)
    const [itemCount, productCount, categoryCount, saleCount] = await Promise.all([
      prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM "Item" WHERE "storeId" IS NULL` as Promise<[{ count: bigint }]>,
      prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM "Product" WHERE "storeId" IS NULL` as Promise<[{ count: bigint }]>,
      prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM "Category" WHERE "storeId" IS NULL` as Promise<[{ count: bigint }]>,
      prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM "Sale" WHERE "storeId" IS NULL` as Promise<[{ count: bigint }]>,
    ]);

    const itemCountNum = Number(itemCount[0].count);
    const productCountNum = Number(productCount[0].count);
    const categoryCountNum = Number(categoryCount[0].count);
    const saleCountNum = Number(saleCount[0].count);

    console.log("\n📊 Existing data counts (without storeId):");
    console.log(`   Items: ${itemCountNum}`);
    console.log(`   Products: ${productCountNum}`);
    console.log(`   Categories: ${categoryCountNum}`);
    console.log(`   Sales: ${saleCountNum}`);

    // Step 5: Update Items
    if (itemCountNum > 0) {
      console.log("\n🔄 Updating items...");
      const itemsResult = await prisma.$executeRaw`
        UPDATE "Item"
        SET "storeId" = ${defaultStoreId}::uuid
        WHERE "storeId" IS NULL
      `;
      console.log(`✅ Updated ${itemsResult} items`);
    }

    // Step 6: Update Products
    if (productCountNum > 0) {
      console.log("\n🔄 Updating products...");
      const productsResult = await prisma.$executeRaw`
        UPDATE "Product"
        SET "storeId" = ${defaultStoreId}::uuid
        WHERE "storeId" IS NULL
      `;
      console.log(`✅ Updated ${productsResult} products`);
    }

    // Step 7: Update Categories
    if (categoryCountNum > 0) {
      console.log("\n🔄 Updating categories...");
      const categoriesResult = await prisma.$executeRaw`
        UPDATE "Category"
        SET "storeId" = ${defaultStoreId}::uuid
        WHERE "storeId" IS NULL
      `;
      console.log(`✅ Updated ${categoriesResult} categories`);
    }

    // Step 8: Update Sales
    if (saleCountNum > 0) {
      console.log("\n🔄 Updating sales...");
      const salesResult = await prisma.$executeRaw`
        UPDATE "Sale"
        SET "storeId" = ${defaultStoreId}::uuid
        WHERE "storeId" IS NULL
      `;
      console.log(`✅ Updated ${salesResult} sales`);
    }

    // Step 9: Handle StoreStatus for default store
    const existingStatus = await prisma.storeStatus.findUnique({
      where: { storeId: defaultStoreId },
    });

    if (!existingStatus) {
      // Check if there's a StoreStatus with NULL storeId
      const nullStatusResult = await prisma.$queryRaw<[{ id: string }]>`
        SELECT id FROM "StoreStatus" WHERE "storeId" IS NULL LIMIT 1
      `;
      
      if (nullStatusResult.length > 0) {
        // Update existing NULL status to use default store
        console.log("\n🔄 Updating existing store status to default store...");
        await prisma.$executeRaw`
          UPDATE "StoreStatus"
          SET "storeId" = ${defaultStoreId}::uuid
          WHERE "storeId" IS NULL
        `;
        console.log("✅ Store status updated");
      } else {
        // Create new status for default store
        console.log("\n🔄 Creating store status for default store...");
        await prisma.storeStatus.create({
          data: {
            storeId: defaultStoreId,
            isOpen: true,
          },
        });
        console.log("✅ Store status created");
      }
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run: npx prisma generate");
    console.log("   2. Restart your development server");
    console.log("   3. Test the application");

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
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
