import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user-access";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Check authentication first
  if (!user) {
    redirect("/login");
  }

  // Only admin can access user management
  if (user.role !== "ADMIN") {
    redirect("/admin");
  }

  return <>{children}</>;
}
