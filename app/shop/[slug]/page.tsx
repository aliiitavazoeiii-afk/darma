import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/lib/catalog";
import { seoMetadata } from "@/lib/metadata";
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
  return (
    <>
      <SiteHeader />
      <main className="inner-shell">
        <header className="inner-hero">
          <span className="editorial-label">{collection.eyebrow}</span>
          <h1>{collection.name} دارما</h1>
          <p>{collection.description}</p>
        </header>
        <div className="inner-body">
          <nav className="inner-breadcrumbs" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link><span>/</span><Link href="/shop">فروشگاه</Link><span>/</span><span>{collection.name}</span>
          </nav>
          <h2>جزئیات مجموعه</h2>
          <p>در این بخش، محصولات واقعی این مجموعه همراه با تصویر، قیمت، رنگ، سایز و تعداد در بسته قرار می‌گیرند.</p>
          <p className="note-panel">در حال اتصال به کاتالوگ واقعی. هیچ محصول یا قیمتی به‌صورت فرضی در سایت قرار نگرفته است.</p>
          <Link className="button button--dark-outline" href="/shop">بازگشت به مجموعه‌ها</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
