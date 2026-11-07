import type { Metadata } from "next";
import Link from "next/link";
import { seoMetadata } from "@/lib/metadata";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCmsHome } from "@/lib/cms";

export const metadata: Metadata = seoMetadata({
  title: "درباره برند دارما",
  description: "با برند دارما و رویکرد آن به معرفی دقیق مدل‌ها، سایزها و بسته‌بندی لباس زیر زنانه آشنا شوید.",
  path: "/about",
  indexable: true
});

export default async function AboutPage() {
  const copy=await getCmsHome();
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero">
          <span className="editorial-label">OUR STORY</span>
          <h1>{copy.about_heading??"درباره دارما"}</h1>
          <p>{copy.about_intro??"دارما؛ از جزئیات پارچه تا انتخاب محصول."}</p>
        </header>
        <section className="inner-body">
          <nav className="inner-breadcrumbs" aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><span>درباره دارما</span></nav>
          <h2>{copy.about_section_heading??"هر انتخاب، یک تجربه"}</h2>
          <p>{copy.about_section_text??"در دارما تلاش می‌کنیم معرفی محصول، انتخاب رنگ و سایز و شناخت بسته‌های چندعددی روشن و ساده باشد. در نسخه نهایی این صفحه، داستان تأییدشده برند، تصاویر واقعی فرایند تولید و اطلاعات ارتباطی اضافه می‌شود."}</p>
          <Link className="button button--dark-outline" href="/shop">دیدن مجموعه‌ها</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
