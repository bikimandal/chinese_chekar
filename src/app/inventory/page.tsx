import { prisma } from "@/lib/prisma";
import { getDefaultStoreBySlug } from "@/lib/store";
import ShopClosed from "./components/ShopClosed";
import InventoryClient from "./InventoryClient";
import InventoryHeader from "./InventoryHeader";

export const revalidate = 0; // Disable cache for live inventory

export default async function InventoryPage() {
  // Get default store ID (for public frontend)
  let defaultStoreId: string;
  try {
    defaultStoreId = await getDefaultStoreBySlug();
  } catch (error) {
    // If no default store exists, show error
    return (
      <div className="min-h-screen bg-dark-bg p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Store Not Found</h1>
          <p className="text-slate-400">Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  // Check store status for default store
  let storeStatus = null;
  try {
    storeStatus = await prisma.storeStatus.findUnique({
      where: { storeId: defaultStoreId },
    });
  } catch (error) {
    // If model doesn't exist yet, continue with showing inventory
  }

  // If store is closed, show closed page
  if (storeStatus && !storeStatus.isOpen) {
    return <ShopClosed message={storeStatus.message || undefined} />;
  }

  // Optimized: Run queries in parallel instead of sequential
  const [items, categories] = await Promise.all([
    prisma.item.findMany({
      where: {
        storeId: defaultStoreId, // Always use default store for public
        isVisible: true,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.category.findMany({
      where: {
        storeId: defaultStoreId, // Always use default store for public
        isActive: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-dark-bg p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Inventory Items with Skeleton Loader */}
        <InventoryClient initialItems={items} />
      </div>
    </div>
  );
}
