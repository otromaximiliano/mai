import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { siteConfig } from "@/config/site-config";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

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
    <html lang="es" className={`scroll-smooth antialiased ${poppins.variable}`}>
      <body className="min-h-screen bg-white text-apple-dark font-sans selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
