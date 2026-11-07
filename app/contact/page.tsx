import type { Metadata } from "next";
import Link from "next/link";
import { seoMetadata } from "@/lib/metadata";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCmsHome } from "@/lib/cms";

export const metadata: Metadata = seoMetadata({
  title: "تماس با دارما",
  description: "راه‌های ارتباط با برند لباس زیر زنانه دارما. اطلاعات رسمی تماس پس از تأیید منتشر می‌شود.",
  path: "/contact",
  indexable: false
});

export default async function ContactPage() {
  const copy=await getCmsHome();
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero">
          <span className="editorial-label">GET IN TOUCH</span><h1>{copy.contact_heading??"ارتباط با دارما"}</h1>
          <p>{copy.contact_intro??"اطلاعات رسمی تماس و نشانی بعد از تأیید نهایی در این صفحه قرار می‌گیرد."}</p>
        </header>
        <div className="inner-body">
          <nav className="inner-breadcrumbs" aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><span>تماس با ما</span></nav>
          <h2>{copy.contact_section_heading??"همراه دارما باشید"}</h2>
          <p>{copy.contact_section_text??"راه‌های ارتباطی معتبر، شرایط پاسخ‌گویی و آدرس در مرحله آماده‌سازی هستند. از ثبت شماره، ایمیل یا نشانی ساختگی خودداری شده است."}</p>
          <p className="note-panel">برای نسخه زنده، انتشار اطلاعات تماس معتبر و سیاست‌های خرید پیش‌نیاز خواهد بود.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
