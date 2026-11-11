import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanderView } from "@/components/LanderView";
import { getDomain, recordVisit } from "@/lib/inventory";
import { landerCanonical } from "@/lib/seo";

interface Props {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  const record = getDomain(domain.toLowerCase());
  if (!record || record.status !== "hold") return {};
  return { alternates: { canonical: landerCanonical(record.domain) } };
}

export default async function HoldPage({ params }: Props) {
  const { domain } = await params;
  const record = getDomain(domain.toLowerCase());
  if (!record || record.status !== "hold") notFound();

  const h = await headers();
  recordVisit(record.domain, `/hold/${record.domain}`, h.get("referer"), h.get("user-agent"));

  return <LanderView record={record} />;
}
