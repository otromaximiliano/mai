import type { Metadata } from "next";
import { siteConfig } from "@/config/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} • ${siteConfig.brand.tagline}`,
  description: siteConfig.brand.description,
  metadataBase: new URL(`https://${siteConfig.brand.domain}`),
  openGraph: {
    title: `${siteConfig.brand.name} • ${siteConfig.brand.tagline}`,
    description: siteConfig.brand.description,
    url: `https://${siteConfig.brand.domain}`,
    siteName: siteConfig.brand.name,
    locale: "es_PY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth antialiased">
      <body className="min-h-screen bg-white text-apple-dark font-sans selection:bg-apple-dark selection:text-white">
        {children}
      </body>
    </html>
  );
}
