import Link from "next/link";
import { Icon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="about-darma">
      <div className="site-footer__landscape" aria-hidden="true" />
      <div className="site-footer__grid content-width">
        <div className="site-footer__map" role="note" aria-label="نقشه و موقعیت پس از تأیید نشانی افزوده می‌شود">
          <span className="editorial-label">OUR LOCATION</span>
          <strong>موقعیت دارما</strong>
          <p>نقشه پس از تأیید نشانی رسمی اضافه می‌شود.</p>
        </div>
        <div className="site-footer__service">
          <div><Icon name="feather" size={26}/><span>پشتیبانی</span><small>راه‌های تماس به‌زودی</small></div>
          <div><Icon name="truck" size={26}/><span>ارسال سفارش</span><small>شرایط پس از تأیید</small></div>
          <div><Icon name="shield" size={26}/><span>اطلاعات خرید</span><small><Link href="/contact">تماس با ما</Link></small></div>
        </div>
        <div className="site-footer__about">
          <h2>درباره دارما</h2>
          <p>دارما، مجموعه‌ای از لباس زیر زنانه با تمرکز بر تجربه خرید روشن و معرفی دقیق مدل‌ها، رنگ‌ها و سایزها.</p>
          <Link href="/about">بیشتر درباره ما <Icon name="arrow" size={16}/></Link>
        </div>
        <div className="site-footer__identity">
          <strong lang="en">DARMA</strong>
          <span className="editorial-label">WOMEN&apos;S UNDERWEAR</span>
          <Link href="/contact" aria-label="ارتباط با ما"><Icon name="heart"/></Link>
        </div>
      </div>
      <div className="site-footer__bottom content-width">
        <span>© DARMA</span>
        <div><Link href="/shop">فروشگاه</Link><Link href="/magazine">مجله</Link><Link href="/contact">تماس</Link></div>
        <span lang="en">darmawear.ir</span>
      </div>
    </footer>
  );
}
