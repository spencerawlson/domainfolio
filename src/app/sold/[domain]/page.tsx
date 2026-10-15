import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { LanderView } from "@/components/LanderView";
import { getDomain, recordVisit } from "@/lib/inventory";

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function SoldPage({ params }: Props) {
  const { domain } = await params;
  const record = getDomain(domain.toLowerCase());
  if (!record || record.status !== "sold") notFound();

  const h = await headers();
  recordVisit(record.domain, `/sold/${record.domain}`, h.get("referer"), h.get("user-agent"));

  return <LanderView record={record} />;
}
