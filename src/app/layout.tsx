import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const name = process.env.PORTFOLIO_NAME || "Domainfolio";

// Same type pairing as Farelune. Self-hosted at build time by next/font:
// no runtime requests to Google.
const heading = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: name, template: `%s | ${name}` },
  description: "Premium domain names for sale.",
};

export const viewport: Viewport = {
  themeColor: "#fdfcf8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
