import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@/lib/catalog";
import { seoMetadata } from "@/lib/metadata";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCmsHome, getCmsCategories } from "@/lib/cms";
import { getCmsPublishedProducts } from "@/lib/cms-products";

export const metadata: Metadata = seoMetadata({
  title: "مجموعه شورت زنانه دارما",
  description: "مجموعه‌های شورت زنانه دارما را بر اساس نوع مدل و بسته‌بندی بررسی کنید. فهرست محصولات پس از تأیید مشخصات و موجودی منتشر می‌شود.",
  path: "/shop",
  indexable: false
});

export default async function ShopPage() {
  const [copy,editorCategories,products]=await Promise.all([
    getCmsHome(),getCmsCategories(),getCmsPublishedProducts()
  ]);
  const shownCollections=collections.map(c=>({...c,name:editorCategories.find(x=>x.slug===c.slug&&x.visible)?.name??c.name}));
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero">
          <span className="editorial-label">THE COLLECTIONS</span>
          <h1>فروشگاه دارما</h1>
          <p>{copy.shop_page_intro??"مدل‌های لباس زیر زنانه دارما را در دسته‌بندی‌های مختلف ببینید. انتخاب محصول، سایز، رنگ و تعداد در بسته پس از اتصال کاتالوگ اصلی فعال خواهد شد."}</p>
        </header>
        <div className="inner-body">
          <div className="inner-breadcrumbs"><Link href="/">خانه</Link><span>/</span><span>فروشگاه</span></div>
          <h2>مجموعه‌ها</h2>
          <div className="collection-links">
            {shownCollections.map((collection) => (
              <Link href={"/shop/" + collection.slug} className="collection-link" key={collection.slug}>
                <strong>{collection.name}</strong><small>{collection.eyebrow}</small>
              </Link>
            ))}
          </div>
          {products.length>0&&<section aria-labelledby="published-products-title">
            <h2 id="published-products-title">محصولات تأییدشده دارما</h2>
            <div className="darma-product-grid">
              {products.map(p=>(
                <Link key={p.slug} className="darma-product-tile" href={"/product/"+p.slug}>
                  {p.image&&<img src={p.image} alt={p.title} loading="lazy" decoding="async"/>}
                  <strong>{p.title}</strong>
                  <span>{new Intl.NumberFormat("fa-IR").format(Math.min(...p.variants.map(v=>v.priceIrr))/10)} تومان</span>
                </Link>
              ))}
            </div>
          </section>}
          <p className="note-panel">نسخه پیش‌نمایش: فقط مشخصات تأییدشده در این صفحه نمایش داده می‌شوند. خرید و پرداخت آنلاین هنوز فعال نیستند؛ تا آماده‌شدن فرایند فروش و سیاست‌های خرید، ایندکس عمومی بسته می‌ماند.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
