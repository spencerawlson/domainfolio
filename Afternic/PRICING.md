# Pricing rule — list prices are set so the NET is the target

We list on Afternic at the 25% tier (own nameservers, Boost off). To keep the target amount after
commission:

```
list price = target net ÷ 0.75   (rounded up to the next $5)
```

The same list price is shown on the Domainfolio site, so buyers see one price everywhere. A direct
sale through our own site (Escrow.com, a few % fee) therefore nets more than the target.

| Domain | Target net | List price | Afternic −25% | Net via Afternic | Net direct (≈) |
|---|---|---|---|---|---|
| axionory.com | 2,495 | **3,330** | 832.50 | 2,497.50 | ~3,230 |
| trivantaq.com | 1,695 | **2,260** | 565.00 | 1,695.00 | ~2,190 |
| opsnestly.com | 1,295 | **1,730** | 432.50 | 1,297.50 | ~1,675 |

**If Afternic Boost is ever turned on (+5% → 30%)**, recompute with `÷ 0.70`:
axionory.com 3,565 · trivantaq.com 2,425 · opsnestly.com 1,850.

**Adding a new domain:** pick the target net, compute the list price with the rule above, then set
it in Domainfolio admin (`/admin/domains`) and in Afternic. Never set a minimum offer.
