import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (!verifySession(session)) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
