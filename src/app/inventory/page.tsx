import { prisma } from "@/lib/prisma";
import ShopClosed from "./components/ShopClosed";
import InventoryClient from "./InventoryClient";
import InventoryHeader from "./InventoryHeader";

export const revalidate = 0; // Disable cache for live inventory

export default async function InventoryPage() {
  // Check store status first
  let storeStatus = null;
  try {
    storeStatus = await prisma.storeStatus.findFirst({
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    // If model doesn't exist yet, continue with showing inventory
    // Continue - show inventory by default if status check fails
  }

  // If store is closed, show closed page
  if (storeStatus && !storeStatus.isOpen) {
    return <ShopClosed message={storeStatus.message || undefined} />;
  }

  // If store is open, show inventory
  const items = await prisma.item.findMany({
    where: {
      isVisible: true,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
  });

  return (
    <div className="min-h-screen bg-dark-bg p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <InventoryHeader />
        {/* Inventory Items with Skeleton Loader */}
        <InventoryClient initialItems={items} />
      </div>
    </div>
  );
}
