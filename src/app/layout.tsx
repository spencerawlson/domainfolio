import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const name = process.env.PORTFOLIO_NAME || "Domainfolio";

// Same type pairing as the DJINN Command Cockpit. Self-hosted at build time by
// next/font: no runtime requests to Google.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: name, template: `%s | ${name}` },
  description: "Premium domain names for sale.",
};

export const viewport: Viewport = {
  themeColor: "#0b0e1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
