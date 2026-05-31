import { isAuthenticated } from "@/lib/auth";
import { AdminLandingContent } from "@/components/admin-landing-content";

export default async function AdminLandingPage() {
  const authed = await isAuthenticated();
  return <AdminLandingContent authed={authed} />;
}
