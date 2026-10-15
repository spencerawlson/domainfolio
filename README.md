# Domainfolio

A domain portfolio and for-sale lander platform. One app serves a **"this domain is for
sale"** page for every domain you own: each request's Host header is matched against your
inventory, and the right lander is rendered. The portfolio's own host renders a catalog of
all listed names. Offers land in a database inbox, and lander visits are logged per domain
so traffic informs pricing.

## How it works

- **Middleware** (`src/middleware.ts`) normalizes the Host header (lowercase, strips
  `www.` and the port), then consults the inventory:
  - host is `PORTFOLIO_HOST` → the catalog (all for-sale domains, search + category filter)
  - host matches a `for_sale` domain → its lander, with price, monthly-payment line, and
    offer form
  - host matches a `sold` / `hold` domain → a simple status page
  - host matches nothing → `/not-listed`
- **Offers** (`POST /api/offers`) are validated (email, positive amount, message cap,
  honeypot, 5-per-hour per IP) and stored in SQLite. If SMTP is configured, a
  notification email is sent; email failure never fails the request.
- **Visits** are recorded on every lander render (common bot user-agents are skipped).
- **Admin** (`/admin`, password gate) shows a dashboard, domain management (add/edit with
  status, price, minimum offer, category, tagline, registrar, expiry), the offers inbox
  (mark read/handled/dismissed), and per-domain visit stats.
- The database is SQLite behind a small data module (`src/lib/db.ts`, `src/lib/inventory.ts`),
  so it can be swapped for Postgres later without touching the pages. Tables are created
  automatically on first run.

## Local development

```bash
cp .env.example .env   # fill in ADMIN_PASSWORD and SESSION_SECRET at minimum
npm install
npm run seed           # sample listings so every page can be tried
npm run dev
```

Open http://localhost:3000 for the catalog. To preview a lander locally, either send a
Host header (`curl -H "Host: bluemeadow.com" http://localhost:3000/`) or visit
http://localhost:3000/lander/bluemeadow.com directly.

## Adding a domain

1. In the admin panel (`/admin/domains`), add the domain: status `for_sale`, price (or
   leave empty for make-an-offer), category, tagline.
2. At your DNS provider (Cloudflare recommended): create an A record for the domain
   pointing at your server, or route it through your tunnel, and make sure HTTPS is on.
3. Visit the domain — its lander appears automatically.

Per-domain HTTPS in production comes from Cloudflare's edge certificates, one per domain.
The app itself never manages certificates.

## Selling a domain (closing flow)

1. A buyer submits an offer on the lander; you get an email and the offer sits in
   `/admin/offers`.
2. Negotiate by email until you agree on a price.
3. Open an escrow transaction (e.g. Escrow.com): the buyer funds escrow, you push the
   domain to their registrar account, escrow releases the money. Never accept card
   payments directly for a domain sale.
4. Mark the domain `sold` in the admin panel.

## Deploying with Docker

```bash
cp .env.example .env   # set ADMIN_PASSWORD, SESSION_SECRET, PORTFOLIO_HOST, PORTFOLIO_URL, SMTP_*
docker compose up -d --build
```

The web service listens on host port **8096**; the SQLite file lives in the
`domainfolio-data` named volume. Point your domains at this host (Cloudflare → server IP
or tunnel public hostname → `http://localhost:8096`) and add each domain's DNS.

## Environment

See `.env.example`. The essentials:

| Variable | Purpose |
|---|---|
| `PORTFOLIO_NAME` | Brand shown on the catalog |
| `PORTFOLIO_HOST` | Host that renders the catalog instead of a lander |
| `PORTFOLIO_URL` | Canonical portfolio URL, linked from the not-listed page |
| `DEFAULT_CURRENCY` | ISO code for price formatting (default `USD`) |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `SESSION_SECRET` | Signs the admin session cookie (long random string) |
| `SMTP_*`, `OFFERS_NOTIFY_EMAIL` | New-offer email notifications (optional) |
| `DATA_DIR` | Where the SQLite file lives (default `./data`) |

`TURNSTILE_SECRET` is reserved: the offer form has a marked integration point for a
CAPTCHA widget in a later version; v1 relies on the honeypot field plus rate limiting.

## Tests

```bash
npm test
```

Covers host normalization and routing decisions, price formatting (including the
12-payment split), and offer validation rules.
