import { redirect } from "next/navigation";
import { selectProviderAction } from "@/lib/actions";
import { isAuthenticated } from "@/lib/auth";

export default async function ElegirProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const { id } = await params;
  await selectProviderAction(id);
}
