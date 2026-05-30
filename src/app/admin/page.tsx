import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  redirect("/admin/dashboard");
}
