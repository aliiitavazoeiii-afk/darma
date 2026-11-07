import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/lib/catalog";
import { seoMetadata } from "@/lib/metadata";
import { getCmsCategories } from "@/lib/cms";
import { getCmsPublishedProducts } from "@/lib/cms-products";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { robots: { index: false, follow: false } };
  return seoMetadata({
    title: collection.name + " دارما",
    description: collection.description,
    path: "/shop/" + collection.slug,
    indexable: collection.ready
  });
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const [editorCategories,products]=await Promise.all([getCmsCategories(),getCmsPublishedProducts()]);
  const editor=editorCategories.find(c=>c.slug===slug&&c.visible);
  const label=editor?.name??collection.name;
  const description=editor?.description??collection.description;
  const matches=products.filter(p=>p.categorySlug===slug);
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero">
          <span className="editorial-label">{editor?.eyebrow??collection.eyebrow}</span>
          <h1>{label} دارما</h1>
          <p>{description}</p>
        </header>
        <div className="inner-body">
          <nav className="inner-breadcrumbs" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link><span>/</span><Link href="/shop">فروشگاه</Link><span>/</span><span>{label}</span>
          </nav>
          <h2>جزئیات مجموعه</h2>
          {matches.length>0 ? <div className="darma-product-grid">
            {matches.map(p=>(
              <Link key={p.slug} className="darma-product-tile" href={"/product/"+p.slug}>
                {p.image&&<img src={p.image} alt={p.title} loading="lazy" decoding="async"/>}
                <strong>{p.title}</strong>
                <span>{new Intl.NumberFormat("fa-IR").format(Math.min(...p.variants.map(v=>v.priceIrr))/10)} تومان</span>
              </Link>
            ))}
          </div> : <p className="note-panel">برای این مجموعه هنوز محصول تأییدشده‌ای منتشر نشده است؛ قیمت یا موجودی فرضی نمایش داده نمی‌شود.</p>}
          <Link className="button button--dark-outline" href="/shop">بازگشت به مجموعه‌ها</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
