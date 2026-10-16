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

/** Monthly payment shown beside a buy-it-now price: ceil(price / 12). */
export function monthlySplit(amount: number | null | undefined): number | null {
  if (amount === null || amount === undefined || Number.isNaN(amount) || amount <= 0) return null;
  return Math.ceil(amount / 12);
}

export function formatMonthly(amount: number | null | undefined, currency?: string): string | null {
  const m = monthlySplit(amount);
  return m === null ? null : formatPrice(m, currency);
}
