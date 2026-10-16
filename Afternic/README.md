# Afternic — listing & sales playbook

Afternic (owned by GoDaddy) shows our names as **"available — buy now"** when someone searches
for them at GoDaddy and Afternic's partner registrars. Our own sale pages only reach people who
already know a name; Afternic puts the names in front of people actually shopping for domains.

| File | What it is |
|---|---|
| [README.md](README.md) | This playbook (steps 1–6, step 2 transfer plan, sale flow) |
| [listings.csv](listings.csv) | The three listings, ready to copy into Afternic |
| [PRICING.md](PRICING.md) | How list prices are calculated (net after commission) |

> Rates, screens and partner lists change. Confirm commission and options in your Afternic
> account before listing. Figures here were checked on 2026-10-16.

---

## Key facts

- **Commission (seller pays, $15 minimum):**
  - **25%** if the domain keeps its own nameservers ← **our case** (keeps our Domainfolio sale pages)
  - 15% only if the domain uses GoDaddy/Afternic aftermarket nameservers (replaces our sale pages)
  - **+5%** if *Afternic Boost* is on → **keep Boost OFF**
- **Fast Transfer** (instant buy at partner registrars) requires the domain to be registered at a
  partner registrar. Cloudflare is not confirmed as a partner, so until Step 2 sales are delivered
  manually with Afternic's Transaction Assurance team.
- **60-day lock:** new registrations can't move to another registrar for 60 days. Ours were
  registered 2026-10-15 → **earliest registrar transfer ≈ 2026-12-14**.

---

## Steps 1–6 — list the names (≈ 10 minutes)

### 1. Create the account
- Go to **https://www.afternic.com** → **Sign up** (or sign in with a GoDaddy account).
- Use your real name and contact details — payouts are made to this identity.

### 2. Add the domains
- **Portfolio / My Domains → Add Domains**.
- Paste: `axionory.com`, `trivantaq.com`, `opsnestly.com`.

### 3. Set prices and details
Use [listings.csv](listings.csv):

| Domain | Buy Now (USD) | Floor / minimum | Category | Description |
|---|---|---|---|---|
| axionory.com | 3330 | *(empty)* | Technology / Brandable | A crisp, confident name for an AI, analytics, or deep-tech company. |
| trivantaq.com | 2260 | *(empty)* | Finance / Fintech | A sharp name for a quant, trading, or financial-data platform. |
| opsnestly.com | 1730 | *(empty)* | Technology / SaaS | A friendly home for a DevOps, IT-ops, or internal-tools product. |

- **Floor price:** leave empty (we don't use minimum offers). If Afternic forces one, set it equal
  to the Buy Now price.
- **Currency:** USD.

### 4. Nameservers / landing page and Boost
- **Keep current nameservers.** Do **not** switch to Afternic's landing page — our sale pages on
  each domain stay live (they run through the Cloudflare tunnel on the Fedora server).
- **Afternic Boost: OFF** (it adds 5% and our prices are calculated for 25%).

### 5. Verify ownership (only if Afternic asks)
- Afternic offers **TXT** or **NS3** verification → choose **TXT** (NS3 can disturb DNS).
- Copy the TXT value from **Afternic → Owner Settings**.
- In **https://dash.cloudflare.com** → the domain → **DNS → Records → Add record**:
  - Type `TXT`, Name as Afternic shows (usually `@`), Content = the code, **Save**.
- Back in Afternic → **Verify**. Leave the record in place until verification completes.

### 6. Payout
- **Account → Payment / Payout settings** → add your payout method (bank wire or what's offered
  for Canada) and tax information if requested.

---

## Step 2 (after ≈ 2026-12-14) — become Fast Transfer eligible

Goal: instant "buy now" checkout at partner registrars, **without losing our sale pages**.

1. Check Afternic's **current Fast Transfer partner registrar list**; pick one (likely GoDaddy).
2. In Cloudflare → **Domain Registration → Manage Domains** → each sale domain:
   - turn **off** the transfer lock, then **Get authorization code**.
3. At the new registrar, start a **transfer in** for each domain with its code (usually includes
   one renewal year).
4. At the new registrar, set **custom nameservers** to the domain's existing **Cloudflare
   nameservers** (shown in Cloudflare → domain → **DNS → Records**/Overview). Keeping Cloudflare
   DNS keeps the tunnel, sale pages and settings working.
5. Approve the transfer-out email from Cloudflare if one arrives; transfers take 1–7 days.
6. In Afternic, confirm each domain now shows **Fast Transfer: eligible**.

`domainfolio.site` stays at Cloudflare — it's the catalog/admin and email-forwarding domain.

---

## When a name sells on Afternic

1. Afternic emails you; the buyer's payment is collected by Afternic (not by you).
2. **Before Step 2 (manual):** Afternic's Transaction Assurance team emails delivery instructions —
   usually unlock the domain and send the auth code (Cloudflare → Manage Domains → domain).
3. **After Step 2 (Fast Transfer):** the transfer runs automatically.
4. In **Domainfolio admin** (`https://domainfolio.site/admin` → Domains) set the domain to **Sold**.
5. In Cloudflare Zero Trust → Tunnels → **domainfolio** → Public Hostname: remove the sold domain.
6. Afternic pays out (sale price − 25%) to your payout method. Keep the receipt for taxes.

## When a buyer comes through our own site

Direct sales pay **no Afternic commission**. Follow the escrow flow: agree price by email →
Escrow.com transaction (seller pays fee) → transfer after Escrow confirms funds → buyer confirms →
payout. **Then delist the name on Afternic immediately** so it can't sell twice.

## Red flags

- Anyone asking for the domain **before** payment is secured (Afternic or Escrow.com).
- "Afternic" emails with odd links — always log in at afternic.com directly to check.
- Requests to pay outside Afternic/Escrow.com (crypto, gift cards, direct card payments).
