import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import "@/app/hero-font-imports";
import { SITE_LIVE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "DARMA",
  title: {
    default: "دارما | لباس زیر زنانه و پک شورت زنانه",
    template: "%s | دارما"
  },
  description: "مجموعه‌های دارما را ببینید و با معرفی دقیق مدل‌ها، سایزها و بسته‌بندی‌ها برای خرید لباس زیر زنانه انتخاب آگاهانه‌تری داشته باشید.",
  alternates: { canonical: "/" },
  robots: { index: SITE_LIVE, follow: SITE_LIVE },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "DARMA",
    url: SITE_URL,
    title: "دارما | لباس زیر زنانه",
    description: "مجموعه لباس زیر زنانه دارما و راهنمای انتخاب مدل و سایز"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#241b1a"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
