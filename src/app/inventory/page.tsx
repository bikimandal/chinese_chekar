import { prisma } from "@/lib/prisma";
import ShopClosed from "./components/ShopClosed";
import InventoryClient from "./InventoryClient";
import ReloadButton from "@/components/ReloadButton";

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
        <div className="mb-8 sm:mb-10 md:mb-12 text-center px-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
                Live <span className="text-gold-accent">Inventory</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                Browse our real-time stock. Items are updated instantly.
                <br className="hidden sm:block" />
                <span className="block sm:inline mt-1 sm:mt-0">
                  <span className="text-primary-red font-semibold animate-pulse">
                    ● Live Updates Active
                  </span>
                </span>
              </p>
            </div>
            <div className="shrink-0">
              <ReloadButton />
            </div>
          </div>
        </div>

        {/* Categories (Simple Filter UI - implementation would require client component state, keeping it simple server render for now or just listing) */}

        {/* Inventory Items with Skeleton Loader */}
        <InventoryClient initialItems={items} />
      </div>
    </div>
  );
}
