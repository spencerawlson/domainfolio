import type { ValidatedOffer } from "./validation";

/** Send a new-offer notification email. No-op when SMTP is not configured. */
export async function notifyOffer(offer: ValidatedOffer): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, OFFERS_NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !OFFERS_NOTIFY_EMAIL) return;
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    const amount = offer.amount !== null ? ` ($${offer.amount.toLocaleString("en-US")})` : "";
    await transporter.sendMail({
      from: SMTP_USER || `Domainfolio <no-reply@${SMTP_HOST}>`,
      to: OFFERS_NOTIFY_EMAIL,
      // Replying to the notification goes straight to the buyer.
      replyTo: offer.email,
      subject: `New offer on ${offer.domain}${amount}`,
      text: [
        `Domain: ${offer.domain}`,
        `Name: ${offer.name}`,
        `Email: ${offer.email}`,
        `Offer: ${offer.amount !== null ? offer.amount : "(no amount given)"}`,
        ``,
        offer.message ?? "(no message)",
        ``,
        `Review it in the admin panel to mark it read or handled.`,
      ].join("\n"),
    });
  } catch (err) {
    // Email is best-effort: the offer is already stored, so never fail the request.
    console.error("Offer notification email failed:", err);
  }
}
