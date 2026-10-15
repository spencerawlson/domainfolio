import type { Metadata } from "next";
import "./globals.css";

const name = process.env.PORTFOLIO_NAME || "Domainfolio";

export const metadata: Metadata = {
  title: { default: name, template: `%s | ${name}` },
  description: "Premium domain names for sale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
