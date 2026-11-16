import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
} from "@/lib/site";

const name = process.env.PORTFOLIO_NAME || "Domainfolio";

// Same type system as the signed-in Aegis CloudOps console (Inter + a mono for
// values). Self-hosted at build time by next/font: no runtime requests to Google.
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: name, template: `%s | ${name}` },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  // No metadataBase / openGraph.url here: this layout is shared by the
  // portfolio host and every lander host, and a fixed portfolio URL would
  // be wrong on a lander. The og:image URL below is absolute, so it needs
  // no metadataBase to resolve.
  openGraph: {
    type: "website",
    siteName: name,
    title: name,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: name,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE_URL, alt: OG_IMAGE_ALT }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
