import { redirect } from "next/navigation";
import { StoreProvider } from "@/contexts/StoreContext";
import { hasStoreAccess, getCurrentUser } from "@/lib/user-access";
import { prisma } from "@/lib/prisma";
import StoreCookieSetter from "./StoreCookieSetter";

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

  // Get store by slug
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true, isActive: true, slug: true },
  });

  if (!store || !store.isActive) {
    redirect("/admin/access-denied");
  }

  // Check if user has access to this store
  const userHasAccess = await hasStoreAccess(store.id);
  if (!userHasAccess) {
    redirect("/admin/access-denied");
  }

  return (
    <StoreProvider>
      <StoreCookieSetter storeId={store.id} />
      {children}
    </StoreProvider>
  );
}
