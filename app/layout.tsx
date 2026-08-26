import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://darma.biya2film.top"),
  title: {
    default: "دارما | لباس زیر و پوشاک راحتی",
    template: "%s | دارما",
  },
  description:
    "فروشگاه آنلاین دارما؛ تجربه‌ای ساده، سریع و مینیمال برای خرید پوشاک راحتی و لباس زیر.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
