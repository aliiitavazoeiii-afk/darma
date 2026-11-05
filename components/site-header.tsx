import Link from "next/link";
import { Icon } from "@/components/icons";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={overlay ? "site-header site-header--overlay" : "site-header site-header--solid"}>
      <div className="site-header__inner">
        <nav className="site-header__nav" aria-label="ناوبری اصلی">
          <Link href="/shop">محصولات</Link>
          <Link href="/shop/packs">پک‌ها</Link>
          <Link href="/magazine">مجله دارما</Link>
          <Link href="/about">درباره ما</Link>
        </nav>
        <Link className="site-header__brand" href="/" aria-label="صفحه اصلی دارما" lang="en">DARMA</Link>
        <div className="site-header__tools">
          <Link href="/shop" aria-label="جستجو در محصولات"><Icon name="search"/></Link>
          <Link href="/contact" aria-label="ارتباط با دارما"><Icon name="heart"/></Link>
          <Link href="/contact" aria-label="حساب و سفارش‌ها، در حال آماده‌سازی"><Icon name="user"/></Link>
        </div>
      </div>
    </header>
  );
}
