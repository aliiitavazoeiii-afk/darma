import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/icons";
import { collections } from "@/lib/catalog";
import { JsonLd } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";

const editorialTopics = [
  { title: "راهنمای انتخاب سایز", detail: "چطور اندازه مناسب خود را پیدا کنیم؟", theme: "size" },
  { title: "شناخت جنس پارچه‌ها", detail: "تفاوت بافت و ویژگی‌های پارچه‌ها", theme: "material" },
  { title: "نگهداری از لباس زیر", detail: "چطور از بافت و کیفیت مراقبت کنیم؟", theme: "care" }
];

export default function Home() {
  return (
    <>
      <main>
        <section className="hero hero--product" aria-labelledby="hero-title">
          <SiteHeader overlay />
          <div className="hero__scene" aria-hidden="true">
            <picture className="hero__art">
              <source media="(max-width: 650px)" srcSet="/media/hero-mobile.webp" type="image/webp" />
              <img src="/media/hero-desktop.webp" alt="" width={1672} height={941} loading="eager" fetchPriority="high" decoding="async" />
            </picture>
          </div>
          <div className="hero__content content-width">
            <div className="hero__copy">
              <span className="editorial-label">PREMIUM UNDERWEAR</span>
              <h1 id="hero-title" lang="en">DARMA</h1>
              <p>لباس زیر زنانه دارما؛ سادگی، راحتی و طراحی مدرن.</p>
              <Link href="/shop" className="button button--outline">مشاهده مجموعه <Icon name="arrow" size={17}/></Link>
              <div className="hero__pages" aria-hidden="true"><i/><i/><i/></div>
            </div>
          </div>
        </section>

        <div className="benefits" aria-label="ویژگی‌های مجموعه">
          <div className="benefits__grid content-width">
            <div><Icon name="truck" size={30}/><span>ارسال سفارش<small>جزئیات هنگام راه‌اندازی</small></span></div>
            <div><Icon name="sparkle" size={30}/><span>توجه به جزئیات<small>معرفی دقیق هر محصول</small></span></div>
            <div><Icon name="feather" size={30}/><span>انتخاب راحت‌تر<small>مدل، سایز و رنگ</small></span></div>
            <div><Icon name="shield" size={30}/><span>اطلاعات شفاف<small>پیش از خرید</small></span></div>
          </div>
        </div>

        <section className="daily" aria-labelledby="daily-title">
          <div className="daily__visual" aria-hidden="true"><span>CAMPAIGN VISUAL</span></div>
          <div className="daily__message">
            <span className="editorial-label">DAILY DEAL</span>
            <h2 id="daily-title">تخفیف ویژه امروز</h2>
            <p>کمپین روزانه دارما پس از اتصال قیمت و موجودی فعال می‌شود.</p>
            <span className="daily__pending">پیشنهاد ویژه به‌زودی</span>
            <Link href="/shop" className="button button--rose">مشاهده مجموعه <Icon name="arrow" size={17}/></Link>
          </div>
        </section>

        <section className="bestseller" aria-labelledby="best-title">
          <div className="bestseller__copy">
            <span className="editorial-label">THE DARMA EDIT</span>
            <h2 id="best-title">منتخب دارما در دیجی‌کالا</h2>
            <p>بسته‌های دارما و جزئیات انتخاب مدل و تعداد در بسته را مشاهده کنید.</p>
            <Link href="/shop/packs" className="button button--outline">مشاهده بسته‌ها <Icon name="arrow" size={17}/></Link>
          </div>
          <div className="bestseller__stage" aria-hidden="true">
            <span className="bestseller__number">D</span>
            <div className="bestseller__pack">
              <span/><span/><span/><span/>
              <b lang="en">DARMA</b>
            </div>
            <div className="bestseller__pedestal"/>
          </div>
          <div className="bestseller__sidebar"><span className="editorial-label">CURATED</span><span>EVERYDAY<br/>ESSENTIALS</span></div>
        </section>

        <section className="collections editorial-section" aria-labelledby="collections-title">
          <div className="collections__grid">
            <div className="collections__intro">
              <span className="editorial-label">COLLECTIONS</span>
              <h2 id="collections-title">مجموعه محصولات دارما</h2>
              <p>انتخابی ساده‌تر برای سلیقه و نیاز روزمره</p>
            </div>
            <div className="collections__slats">
              {collections.map((collection, index) => (
                <Link key={collection.slug} className={"collection-slat collection-slat--" + (index + 1)} href={"/shop/" + collection.slug}>
                  <span className="collection-slat__detail" aria-hidden="true"/>
                  <span className="collection-slat__label">{collection.name} <Icon name="arrow" size={15}/></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="magazine editorial-section" aria-labelledby="magazine-title">
          <div className="magazine__intro">
            <span className="editorial-label">MAGAZINE</span>
            <h2 id="magazine-title">مجله دارما</h2>
            <p>راهنماها، انتخاب آگاهانه و شناخت پارچه</p>
            <Link className="button button--dark-outline" href="/magazine">مشاهده موضوعات <Icon name="arrow" size={16}/></Link>
          </div>
          <div className="magazine__stories">
            {editorialTopics.map((topic) => (
              <article className={"story story--" + topic.theme} key={topic.theme}>
                <div className="story__picture" aria-hidden="true"/>
                <div className="story__text"><h3>{topic.title}</h3><p>{topic.detail}</p></div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": SITE_URL + "/#organization",
        "name": "دارما",
        "alternateName": "DARMA",
        "url": SITE_URL
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": SITE_URL + "/#website",
        "name": "DARMA",
        "inLanguage": "fa-IR",
        "url": SITE_URL,
        "publisher": { "@id": SITE_URL + "/#organization" }
      }} />
    </>
  );
}
