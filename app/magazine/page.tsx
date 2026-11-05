import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { seoMetadata } from "@/lib/metadata";

export const metadata: Metadata = seoMetadata({
  title: "مجله دارما | راهنمای لباس زیر زنانه",
  description: "راهنماهای تخصصی دارما درباره سایز، جنس پارچه و نگهداری لباس زیر زنانه. مقالات پس از بررسی و تأیید علمی و محصولی منتشر می‌شوند.",
  path: "/magazine",
  indexable: false
});

const topics = [
  { title: "راهنمای انتخاب سایز", description: "مروری بر روش استفاده از جدول اندازه‌گیری واقعی دارما" },
  { title: "شناخت پارچه‌ها", description: "راهنمای جنس، بافت و جزئیات پارچه بر اساس مشخصات تولید" },
  { title: "راهنمای نگهداری", description: "اصول مراقبت و شست‌وشو متناسب با دستور سازنده" }
];

export default function MagazinePage() {
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero"><span className="editorial-label">DARMA MAGAZINE</span><h1>مجله دارما</h1><p>مطالب مفید برای انتخاب آگاهانه؛ نوشته‌شده بر اساس اطلاعات واقعی محصول و تجربه تولید.</p></header>
        <div className="inner-body">
          <nav className="inner-breadcrumbs" aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><span>مجله دارما</span></nav>
          <div className="article-topics">
            {topics.map((topic) => <article className="article-topic" key={topic.title}><h2>{topic.title}</h2><p>{topic.description}</p></article>)}
          </div>
          <p className="note-panel">این‌ها موضوعات برنامه‌ریزی‌شده‌اند، نه مقاله منتشرشده. متن و عکس نهایی پس از بررسی تخصصی و تأیید آماده می‌شود.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
