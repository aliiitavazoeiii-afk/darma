import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader/>
      <main className="inner-shell">
        <header className="inner-hero"><span className="editorial-label">404 — PAGE NOT FOUND</span><h1>این صفحه پیدا نشد</h1><p>ممکن است آدرس تغییر کرده باشد یا محصول هنوز منتشر نشده باشد.</p></header>
        <div className="inner-body"><Link href="/" className="button button--dark-outline">بازگشت به خانه</Link></div>
      </main>
      <SiteFooter/>
    </>
  );
}
