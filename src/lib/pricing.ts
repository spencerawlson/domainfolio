/** Format a dollar amount as currency, e.g. 2400 -> "$2,400". */
export function formatPrice(amount: number | null | undefined, currency?: string): string | null {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return null;
  const cur = (currency || process.env.DEFAULT_CURRENCY || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

/**
 * Monthly lease-to-own payment for a buy-it-now price over a stated term:
 * ceil(price / months). The term comes from the domain's own listing terms
 * (e.g. its Afternic lease-to-own term) — never assume a fixed split.
 */
export function leaseMonthly(
  amount: number | null | undefined,
  months: number | null | undefined,
): number | null {
  if (amount === null || amount === undefined || Number.isNaN(amount) || amount <= 0) return null;
  if (months === null || months === undefined || !Number.isInteger(months) || months < 1) return null;
  return Math.ceil(amount / months);
}

export function formatLeaseMonthly(
  amount: number | null | undefined,
  months: number | null | undefined,
  currency?: string,
): string | null {
  const m = leaseMonthly(amount, months);
  return m === null ? null : formatPrice(m, currency);
}
