import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@/lib/catalog";
import { seoMetadata } from "@/lib/metadata";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = seoMetadata({
  title: "مجموعه شورت زنانه دارما",
  description: "مجموعه‌های شورت زنانه دارما را بر اساس نوع مدل و بسته‌بندی بررسی کنید. فهرست محصولات پس از تأیید مشخصات و موجودی منتشر می‌شود.",
  path: "/shop",
  indexable: false
});

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero">
          <span className="editorial-label">THE COLLECTIONS</span>
          <h1>فروشگاه دارما</h1>
          <p>مدل‌های لباس زیر زنانه دارما را در دسته‌بندی‌های مختلف ببینید. انتخاب محصول، سایز، رنگ و تعداد در بسته پس از اتصال کاتالوگ اصلی فعال خواهد شد.</p>
        </header>
        <div className="inner-body">
          <div className="inner-breadcrumbs"><Link href="/">خانه</Link><span>/</span><span>فروشگاه</span></div>
          <h2>مجموعه‌ها</h2>
          <div className="collection-links">
            {collections.map((collection) => (
              <Link href={"/shop/" + collection.slug} className="collection-link" key={collection.slug}>
                <strong>{collection.name}</strong><small>{collection.eyebrow}</small>
              </Link>
            ))}
          </div>
          <p className="note-panel">نسخه پیش‌نمایش: قیمت، موجودی و عکس محصولات هنوز تأیید نشده‌اند و خرید آنلاین فعال نیست. این صفحه تا آماده‌شدن اطلاعات واقعی برای ایندکس عمومی بسته می‌ماند.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
