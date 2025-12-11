import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import ShopClosed from "./components/ShopClosed";

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
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
  });

  return (
    <div className="min-h-screen bg-dark-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Live <span className="text-gold-accent">Inventory</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our real-time stock. Items are updated instantly.
            <br />
            <span className="text-primary-red font-semibold animate-pulse">
              ● Live Updates Active
            </span>
          </p>
        </div>

        {/* Categories (Simple Filter UI - implementation would require client component state, keeping it simple server render for now or just listing) */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description || ""}
              price={item.price}
              stock={item.stock}
              image={item.image ?? undefined}
              category={item.categoryId || ""} // Ideally map ID to name if needed
              isAvailable={item.isAvailable}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">
              No items currently available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
