import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL environment variable is not set!");
  console.error("Please make sure your .env file exists and contains DATABASE_URL");
  process.exit(1);
}

// Create PostgreSQL pool for seeding
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Create categories
  const starters = await prisma.category.upsert({
    where: { name: "Starters" },
    update: {},
    create: {
      name: "Starters",
      description: "Appetizers and starters",
    },
  });

  const rice = await prisma.category.upsert({
    where: { name: "Rice" },
    update: {},
    create: {
      name: "Rice",
      description: "Fried rice and rice dishes",
    },
  });

  const noodles = await prisma.category.upsert({
    where: { name: "Noodles" },
    update: {},
    create: {
      name: "Noodles",
      description: "Noodle dishes",
    },
  });

  const combos = await prisma.category.upsert({
    where: { name: "Combos" },
    update: {},
    create: {
      name: "Combos",
      description: "Combo meals",
    },
  });

  // Create sample items
  await prisma.item.upsert({
    where: { id: "sample-1" },
    update: {},
    create: {
      id: "sample-1",
      name: "Chicken Lollipop",
      description: "Spicy chicken lollipops",
      price: 180,
      stock: 10,
      categoryId: starters.id,
      isAvailable: true,
      isVisible: true,
    },
  });

  await prisma.item.upsert({
    where: { id: "sample-2" },
    update: {},
    create: {
      id: "sample-2",
      name: "Fried Rice",
      description: "Classic Chinese fried rice",
      price: 120,
      stock: 15,
      categoryId: rice.id,
      isAvailable: true,
      isVisible: true,
    },
  });

  await prisma.item.upsert({
    where: { id: "sample-3" },
    update: {},
    create: {
      id: "sample-3",
      name: "Hakka Noodles",
      description: "Spicy hakka noodles",
      price: 130,
      stock: 8,
      categoryId: noodles.id,
      isAvailable: true,
      isVisible: true,
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:");
    console.error(e);
    if (e.code === "ECONNREFUSED") {
      console.error("\n💡 Connection refused. Please check:");
      console.error("   1. Your DATABASE_URL in .env file is correct");
      console.error("   2. Your Supabase database is active (not paused)");
      console.error("   3. Your connection string format is correct");
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

