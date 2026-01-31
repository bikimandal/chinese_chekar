import { redirect } from "next/navigation";
import { hasStoreAccess, getCurrentUser } from "@/lib/user-access";
import { prisma } from "@/lib/prisma";
import StoreCookieSetter from "./StoreCookieSetter";
import StoreHydrator from "./StoreHydrator";

export default async function StoreSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ "store-slug": string }>;
}) {
  const { "store-slug": storeSlug } = await params;

  // Check authentication first
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Get store by slug (include name + isDefault for context)
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true, name: true, slug: true, isActive: true, isDefault: true },
  });

  if (!store || !store.isActive) {
    redirect("/admin/access-denied");
  }

  // Check if user has access to this store
  const userHasAccess = await hasStoreAccess(store.id);
  if (!userHasAccess) {
    redirect("/admin/access-denied");
  }

  const { isActive: _isActive, ...storeForContext } = store;

  return (
    <>
      <StoreHydrator store={storeForContext} />
      <StoreCookieSetter storeId={store.id} />
      {children}
    </>
  );
}
