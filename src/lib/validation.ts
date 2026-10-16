export interface OfferPayload {
  domain?: unknown;
  name?: unknown;
  email?: unknown;
  amount?: unknown;
  message?: unknown;
  /** Honeypot: must stay empty. */
  website?: unknown;
}

export interface ValidatedOffer {
  domain: string;
  name: string;
  email: string;
  amount: number | null;
  message: string | null;
  isBot: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MESSAGE = 2000;

/** Validate an incoming offer payload. Pure — safe to unit test. */
export function validateOffer(payload: OfferPayload): ValidatedOffer {
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return { domain: "", name: "", email: "", amount: null, message: null, isBot: true };
  }
  const domain = typeof payload.domain === "string" ? payload.domain.trim().toLowerCase() : "";
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" && payload.message.trim() !== ""
      ? payload.message.trim()
      : null;

  if (!domain) throw new Error("A domain is required.");
  if (!name) throw new Error("Your name is required.");
  if (name.length > 120) throw new Error("Name is too long.");
  if (!EMAIL_RE.test(email)) throw new Error("A valid email address is required.");
  if (message !== null && message.length > MAX_MESSAGE) {
    throw new Error(`Message must be under ${MAX_MESSAGE} characters.`);
  }

  let amount: number | null = null;
  if (payload.amount !== undefined && payload.amount !== null && payload.amount !== "") {
    const n = typeof payload.amount === "number" ? payload.amount : Number(payload.amount);
    if (!Number.isFinite(n) || n <= 0) throw new Error("Offer amount must be a positive number.");
    if (n > 100_000_000) throw new Error("Offer amount is unrealistically large.");
    amount = Math.round(n * 100) / 100;
  }

  return { domain, name, email, amount, message, isBot: false };
}
