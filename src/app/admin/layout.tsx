import { redirect } from "next/navigation";
import { StoreProvider } from "@/contexts/StoreContext";
import { getCurrentUser } from "@/lib/user-access";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication - redirect to login if not authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <StoreProvider>{children}</StoreProvider>;
}
