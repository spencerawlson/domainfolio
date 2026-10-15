"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Offer form. The hidden "website" field is a honeypot for bots.
 * A CAPTCHA (e.g. Turnstile) can be added here later: render its widget
 * inside this form and pass the token along in the POST body.
 */
export function OfferForm({
  domain,
  minOfferLabel,
  responseTime,
}: {
  domain: string;
  minOfferLabel: string | null;
  responseTime: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      domain,
      name: form.get("name"),
      email: form.get("email"),
      amount: form.get("amount"),
      message: form.get("message"),
      website: form.get("website"), // honeypot
    };
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="notice" role="status">
        <strong>Offer received.</strong> Thank you — the seller will get back to you within{" "}
        {responseTime}.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {status === "error" && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      <div className="field-row">
        <div className="field">
          <label htmlFor="offer-name">Your name</label>
          <input id="offer-name" name="name" required maxLength={120} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="offer-email">Email</label>
          <input id="offer-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="offer-amount">
          Your offer{minOfferLabel ? ` (minimum ${minOfferLabel})` : ""}
        </label>
        <div className="input-prefix">
          <span aria-hidden="true">$</span>
          <input
            id="offer-amount"
            name="amount"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="Enter an amount"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="offer-message">Message (optional)</label>
        <textarea id="offer-message" name="message" rows={3} maxLength={2000} />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="btn block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send offer"}
      </button>
      <p className="fine">No commitment. Your details are only shared with the seller.</p>
    </form>
  );
}
