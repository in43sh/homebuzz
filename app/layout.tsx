import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/blocks/Header";
import { Footer } from "@/components/blocks/Footer";
import { siteUrl, siteName } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const title = {
  default: `${siteName} — Home improvement store`,
  template: `%s · ${siteName}`,
};
const description =
  `${siteName} — paint, tools, hardware and everything for your home improvement projects.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    siteName,
    title,
    description,
    url: "/",
    locale: "en_US",
  },
  // Only the card type is global; title/description/image fall back per-page
  // to each route's openGraph (or title) values.
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
