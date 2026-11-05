# DARMA SEO plan — baseline / not implemented

Target canonical origin (after launch): https://darmawear.ir
Market: Persian-speaking shoppers in Iran.
Goal: organic category/product discovery; brand-search capture; original useful fit/material/care articles; strong technical foundation. Do not promise rankings.

## Architecture and initial keyword hypotheses (validate with actual search demand)
Homepage: / — "لباس زیر زنانه دارما" / "شورت زنانه دارما"
Category: /shop/ — "خرید شورت زنانه"
Collections if REAL inventory exists:
 /shop/cotton/ "شورت نخی زنانه"
 /shop/lace/ "شورت توری زنانه"
 /shop/packs/ "پک شورت زنانه"
 /shop/packs/3/ "شورت زنانه سه تایی"
 /shop/packs/4/ "پک شورت زنانه چهار تایی"
 /shop/packs/5/ "پک شورت زنانه پنج تایی"
 /shop/packs/6/ "پک شورت زنانه شش تایی"
 /shop/size-guide/ sizing chart
Products: /product/<model-slug>/ with color, size, pack-count as purchasable variants when they belong to a parent product.
Articles: /magazine/<article-slug>/
Required: /about/, /contact/, /shipping/, /returns/, /privacy/, /terms/.

Do not create thin category pages for nonexistent products, or duplicate identical text across packs. Product copy must reflect actual materials, ranges, and sizing data.

## Metadata examples (draft)
Home title: "خرید شورت زنانه و پک لباس زیر زنانه | دارما"
Home meta description: "مجموعه شورت زنانه دارما را بر اساس مدل، سایز، رنگ و تعداد در بسته بررسی کنید. جزئیات محصول، جدول سایزبندی و شیوه ارسال را پیش از خرید ببینید."
Category title template: "<نام دسته> | مشاهده مدل‌ها و قیمت | دارما"
Product title template: "<نام محصول> - <مدل و تعداد> | دارما"
Only one informative H1 per page; headings follow structure; no duplicate titles; self-referential canonical on indexable pages.

## Structured data
- Home: Organization, WebSite with accurate details.
- Category: BreadcrumbList; optional ItemList if faithfully modeled.
- Product: ProductGroup + Product variants + individual Offer when size/color/pack affect price or availability. Server render correct image, SKU, priceCurrency, price, availability and visible content. Use distinct URL for preselectable variants if appropriate.
- Article: Article/BlogPosting + BreadcrumbList with actual date/author/image.
- Review/AggregateRating ONLY if verified and shown on page; no invented Digikala ratings/sales.
- LocalBusiness / physical store schema only if business genuinely qualifies and the address is verified.
- Shipping / returns metadata only for real policies.

## Technical SEO
- Server-rendered crawlable category/product pages and working internal links.
- Next.js metadata and metadataBase / canonical / OpenGraph / Twitter image; locale fa-IR; html lang=fa dir=rtl.
- Dynamic XML sitemap covering ONLY indexable live URLs; robots.txt allows important sections; noindex staging, cart, checkout, private accounts, internal search/facets that should not rank.
- Prevent duplicate content for filter, sort, query parameters through sensible canonical/indexing policy. Do not block URLs in robots if expecting Google to read noindex.
- Unique optimized alt text for informative images, not keyword spam.
- Hero LCP asset preloaded/prioritized with efficient AVIF/WebP and appropriate sizes; below-the-fold images lazy-loaded; font licensing, preloading and subset selection.
- Target excellent real Core Web Vitals (LCP, INP, CLS) on mid-tier Android and Iran mobile networks, measured on live pages rather than invented scores.
- Proper 404/301 for changed slugs; responsive UI; accessible checkout; no intrusive overlays.
- Verify site ownership, submit sitemap, monitor Search Console coverage and queries after launch.

## Content strategy
Pillar categories around real stocked product types.
Initial article briefs:
 1. راهنمای انتخاب سایز شورت زنانه — based on DARMA real size chart, no guessing.
 2. تفاوت پارچه‌های رایج در شورت زنانه — material claims reviewed against supplier specifications.
 3. روش شست‌وشوی لباس زیر زنانه — product-safe care instructions.
 4. انتخاب تعداد در بسته متناسب با نیاز — tie to real pack counts.
 5. شناخت تفاوت مدل‌های دارما — verified features and real photography.
Original photos and genuine FAQ enhance trust.

## Source references
Google Product Variants: https://developers.google.com/search/docs/appearance/structured-data/product-variants
Google Product Snippets: https://developers.google.com/search/docs/appearance/structured-data/product
Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
Next.js Metadata: https://nextjs.org/docs/app/getting-started/metadata-and-og-images

## Before launch
Confirm exact catalog, GTIN/SKUs, model naming, availability, product images, real reviews, payment, refund/shipping copy, real address, whether domain is accessible and SSL valid. Run Lighthouse / PageSpeed / Rich Results Test. SEO plan is ready, implementation remains pending.
