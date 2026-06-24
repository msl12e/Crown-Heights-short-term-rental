import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role === "ADMIN") redirect("/dashboard/admin");
  if (user.role === "HOST") redirect("/dashboard/host");
  redirect("/dashboard/bookings");
}
