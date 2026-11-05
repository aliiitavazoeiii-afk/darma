import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publishedProduct, publishedProducts } from "@/lib/catalog";
import { JsonLd, seoMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sku?: string }>;
};

export function generateStaticParams() {
  return publishedProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = publishedProduct(slug);
  if (!product) return { robots: { index: false, follow: false } };
  return seoMetadata({
    title: product.title,
    description: product.description,
    path: "/product/" + product.slug,
    indexable: Boolean(product.image && product.variants.length && product.variants.every((v) => v.priceIrr !== null && v.priceIrr > 0))
  });
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sku } = await searchParams;
  const product = publishedProduct(slug);
  if (!product) notFound();
  const current = product.variants.find((variant) => variant.sku === sku) ?? product.variants[0];
  const canShowOffers = Boolean(product.image && product.variants.length && product.variants.every((v) => v.sku && v.priceIrr !== null && v.priceIrr > 0));
  const pageUrl = SITE_URL + "/product/" + product.slug;
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero">
          <span className="editorial-label">THE DARMA COLLECTION</span>
          <h1>{product.title}</h1><p>{product.description}</p>
        </header>
        <div className="inner-body">
          <nav className="inner-breadcrumbs" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link><span>/</span><Link href="/shop">فروشگاه</Link><span>/</span><span>{product.title}</span>
          </nav>
          <h2>مشخصات و انتخاب مدل</h2>
          {product.material && <p>جنس پارچه: {product.material}</p>}
          <div className="product-variants">
            {product.variants.map((variant) => (
              <Link key={variant.sku} href={pageUrl + "?sku=" + encodeURIComponent(variant.sku)} className="note-panel" aria-current={current?.sku === variant.sku ? "true" : undefined}>
                <span>سایز {variant.size} · {variant.color} · بسته {variant.packCount} عددی</span>
                <strong>{variant.priceIrr === null ? "قیمت در انتظار تأیید" : new Intl.NumberFormat("fa-IR").format(variant.priceIrr / 10) + " تومان"}</strong>
                <span>{variant.inStock ? "موجود" : "ناموجود"}</span>
              </Link>
            ))}
          </div>
          <p className="note-panel">پرداخت و موجودی تا اتصال به سامانه واقعی و آزمایش درگاه فعال نمی‌شوند.</p>
        </div>
      </main>
      <SiteFooter />
      {canShowOffers && product.image && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "ProductGroup",
          "@id": pageUrl + "#productgroup",
          "name": product.title,
          "description": product.description,
          "url": pageUrl,
          "image": [new URL(product.image, SITE_URL).toString()],
          "brand": { "@type": "Brand", "name": "دارما" },
          "productGroupID": product.slug,
          "variesBy": ["https://schema.org/size", "https://schema.org/color"],
          "hasVariant": product.variants.filter((variant) => variant.priceIrr !== null).map((variant) => ({
            "@type": "Product",
            "name": product.title + " " + variant.size + " " + variant.color + " پک " + variant.packCount,
            "sku": variant.sku,
            "size": variant.size,
            "color": variant.color,
            "image": new URL(product.image as string, SITE_URL).toString(),
            "additionalProperty": [{ "@type": "PropertyValue", "name": "تعداد در بسته", "value": variant.packCount }],
            "offers": {
              "@type": "Offer",
              "url": pageUrl + "?sku=" + encodeURIComponent(variant.sku),
              "priceCurrency": "IRR",
              "price": variant.priceIrr,
              "availability": variant.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          }))
        }} />
      )}
    </>
  );
}
