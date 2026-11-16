/**
 * Shared site constants: the portfolio's public copy and social assets.
 *
 * The meta description names the real listings (Afternic/listings.csv) and
 * stays inside the 120–160 character band search engines display.
 * The og:image URL is absolute on the portfolio's canonical host because
 * Open Graph consumers fetch it from the page, not from the request host.
 */
export const SITE_DESCRIPTION =
  "Premium domain names for sale — axionory.com, trivantaq.com, opsnestly.com and ventoryn.app. Buy outright or make an offer; every sale settles through escrow.";

export const PORTFOLIO_SITE_URL = "https://domainfolio.site";

export const OG_IMAGE_URL = `${PORTFOLIO_SITE_URL}/og-image.png`;

export const OG_IMAGE_ALT =
  "Domainfolio — premium domain names for sale: axionory.com, trivantaq.com, opsnestly.com and ventoryn.app.";
