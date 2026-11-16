"use client";

import { useEffect, useState } from "react";

/**
 * Cookie consent banner (R-04).
 *
 * What this site actually sets today:
 * - `df_admin` — the signed admin sign-in session cookie (essential, 7 days).
 *   Only set after an admin signs in at /admin; visitors never get it.
 * - Your consent choice itself, stored in localStorage (not a cookie).
 * - Nothing else: no analytics, no advertising trackers, no third-party
 *   scripts. The "Analytics" preference below is stored now and honoured
 *   the moment any non-essential tracker is added — until then it gates
 *   nothing, because there is nothing to gate.
 *
 * The banner renders on the server (so it is present in the first HTML)
 * and hides after mount only when a choice is already stored.
 */
const STORAGE_KEY = "domainfolio-cookie-consent";
export const COOKIE_SETTINGS_EVENT = "domainfolio:cookie-settings";

interface Consent {
  necessary: true;
  analytics: boolean;
  decidedAt: string;
}

function readStored(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      (parsed as Consent).necessary === true &&
      typeof (parsed as Consent).analytics === "boolean"
    ) {
      return parsed as Consent;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Footer "Cookie settings" control: reopens the consent banner. Lives in
 * this file (a client component) because the footer itself is rendered by
 * the server-side Shell.
 */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="footer-link"
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
    >
      Cookie settings
    </button>
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setAnalytics(stored.analytics);
      setVisible(false);
    }
    const reopen = () => {
      setShowPreferences(true);
      setVisible(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  function save(choice: boolean) {
    const consent: Consent = {
      necessary: true,
      analytics: choice,
      decidedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // Storage unavailable (private mode, blocked): the banner simply
      // shows again next visit; nothing non-essential loads either way.
    }
    setAnalytics(choice);
    setShowPreferences(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      data-cookie-consent
    >
      <p>
        <strong>We keep cookies to a minimum.</strong> This site only sets the
        cookies it needs to work — your admin sign-in, if you use it — and
        remembers your choice here. We run no analytics or advertising
        trackers right now. See our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
      {showPreferences ? (
        <div className="cookie-prefs">
          <label>
            <input type="checkbox" checked disabled /> Essential cookies —
            required (admin sign-in). Always on.
          </label>
          <label>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />{" "}
            Analytics — not installed yet. Your choice is saved and will apply
            if analytics is ever added.
          </label>
          <div className="cookie-actions">
            <button type="button" className="btn" onClick={() => save(analytics)}>
              Save preferences
            </button>
          </div>
        </div>
      ) : (
        <div className="cookie-actions">
          <button type="button" className="btn" onClick={() => save(true)}>
            Accept all
          </button>
          <button type="button" className="btn ghost" onClick={() => save(false)}>
            Reject non-essential
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setShowPreferences(true)}
          >
            Preferences
          </button>
        </div>
      )}
    </div>
  );
}
