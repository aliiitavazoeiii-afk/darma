# DARMA SEO + AI Discoverability Constitution
Version: 1.0 | Adopted 2026-11-05 | Status: binding product standard for all future code, content, assets and releases.

**North star:** Build darmawear.ir into a credible, original, easy-to-buy Persian underwear brand source. Target first-page rankings for a researched subset of non-branded queries and measurable citations/visibility in search-assisted AI over ~4-5 months, counted from the date the indexable website actually launches. Rankings, crawling, AI inclusion and citations are **not guaranteed**. There is **no official universal AI SEO score**.

## Rule 0: Preserve the approved visual design
The last user-approved editorial mockup and design/APPROVED_VISUAL_SPEC.md are immutable unless the owner approves a revision. SEO is to be integrated as semantic text, metadata, links and correct product data, NOT through cluttering the design or replacing sections with generic grids.

## Rule 1: Human-first truth
- Every publicly visible product claim must be traceable to real products, materials, dimensions, sizes, care directions, photos and live inventory.
- Never invent endorsements, star ratings, order counts, customer counts, discount percentages, Digikala rankings, reviews, material certifications, physical addresses or stock.
- Never bulk-publish filler or machine-generated keyword-variation pages to manipulate rankings.
- Every article must answer a real question with brand-specific knowledge, direct experience, evidence, and review by a responsible human before publication.
- Avoid medical/hygiene claims unless supported by credible sources. Do not infer health benefits from textiles.
- AI can help edit/research/write drafts, not manufacture testimonials or real-world observations.

## Rule 2: Crawlable and indexable architecture
- Public category/product/editorial pages are SSR or pre-rendered and readable as text and actual <a href> links; important text must not exist only in images.
- Production routes return correct 200/301/404/410, canonical, descriptive titles, unique descriptions where appropriate, one visible H1, semantic hierarchy, alt text and internal breadcrumbs.
- XML sitemap lists ONLY public indexable canonical URLs. Noindex staging, checkout, account, cart, internal search and low-value filter/facet pages. Do not accidentally block noindex pages in robots before crawler can see noindex.
- Sitewide absolute HTTPS URLs based on https://darmawear.ir; choose apex or www once, redirect other origin.
- Avoid parameter/canonical duplication, soft 404, orphan pages, infinite faceted indexing, keyword cannibalization and duplicate model/color/pack titles.
- Robots policy: production allow Googlebot, Bingbot and OAI-SearchBot to fetch permitted public pages, including CDN/WAF access. OAI-SearchBot opt-in to discoverability is NOT a guarantee. GPTBot training controls are separate from search discovery; make that independent policy decision explicitly.
- Do not add automatic nosnippet or restrictive max-snippet to indexable content if AI visibility is intended. Do not use llms.txt as a substitute for real SEO.

## Rule 3: E-commerce structured data that matches the page
- Homepage: correct Organization and WebSite entities. Category: BreadcrumbList and optional faithful ItemList. Editorial: BlogPosting/Article with actual date, author, source.
- Purchasable pages: Product / ProductGroup + Product variants and Offer, including unique SKU, real brand, correctly formatted prices, stock, sizes, colors, pack counts, shipping/returns where verified.
- The UI may show toman, but offer schema currency must be a valid ISO currency (normally IRR for Iran), and numerical amounts must be converted accurately to rials from the live source of truth. Do not blindly copy a toman display figure into IRR markup.
- For product variants decide a consistent strategy (canonical parent vs separately indexable variants when content/purchase state warrants it); never auto-create thousands of thin variant URLs.
- JSON-LD must equal rendered public content and server truth. Fake AggregateRating/Review markup is forbidden.
- Validate with Google Rich Results Test and Schema Markup Validator; validity does not guarantee enhanced search presentation.

## Rule 4: Primary visual assets are authentic and optimized
- Real product shots are truth source. Generated editorial images are allowed for aesthetic campaign scenes only when transparently not depicting fictitious sellable SKU.
- Editorial hero content remains accessible HTML; meaningful visuals have descriptive natural Persian alt text, decorative visuals empty alt.
- Prioritize hero LCP; responsive srcset/sizes, proper intrinsic size, WebP/AVIF, lazy below-the-fold, prevent CLS. Images licensed and brand-safe.

## Rule 5: AI answer eligibility / GEO without gimmicks
- Facts should be explicit and consistently named: DARMA / دارما, model, fabric composition if verified, sizes, size-range mappings, color, number per pack, price/availability, care, delivery and returns.
- Product and guide pages answer common natural-language purchasing questions precisely, preferably in descriptive prose plus useful fit/variant tables; never keyword-stuff.
- Show trustworthy about/contact/policies, original ownership and production knowledge, real photo provenance, author/reviewer bylines on substantive articles.
- Ensure OAI-SearchBot is not unintentionally blocked by robots/CDN; public pages remain crawlable/indexable for search engines.
- Measure ChatGPT referral traffic (e.g. source and UTM), visibility/citation through repeatable sampled queries. Do not claim control over AI recommendations.
- Google generative search: use Search Console Generative AI performance report if sufficient impressions are available; it became broadly available in 2026.
- Artificial mentions, purchased citations, fake expert signals, fabricated FAQs, and spammy AI optimization hacks are prohibited.

## Rule 6: Speed and accessibility release budgets
- Core Web Vitals at 75th percentile of real users: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1. Verify with CrUX/Search Console when traffic permits; synthetic Lighthouse is a development diagnostic, not a direct Google rank score.
- Internal performance target for flagship mobile templates: Lighthouse performance >= 90 under consistent reproducible lab settings, tracked but not used as an SEO ranking proxy.
- Semantic Persian RTL, accessible keyboard navigation, readable contrast, no major intrusive popups, honest links/buttons, optimized font loading and image payloads.

## Rule 7: Content authority strategy
- Build interconnected core categories from actually stocked models. Possible clusters: شورت زنانه دارما, پک شورت زنانه, پک سه/چهار/پنج/شش‌تایی, شورت نخی زنانه, شورت توری زنانه IF supported by catalog.
- Helpful evergreen guides: real size table, care instructions, textile types based on procurement/production specs, differences between authentic DARMA models, how to choose pack count.
- Add original studio photos, fit and stitching details, source-backed FAQ answers; avoid generic 1500-word SEO articles with no added value.
- Distribute legitimate brand mentions and press coverage earned through useful materials, not paid link schemes.

## Rule 8: Track outcomes every week
- Sources: Google Search Console, GSC Generative AI report, analytics conversion events, Google/Bing index diagnostics, site crawl, server logs, rich results test and agreed monthly target-query sample.
- Metrics: index coverage of priority URLs, query-by-query top-10 placements, nonbrand clicks & impressions, CTR, organic conversion and revenue, AI-feature impressions (when present), ChatGPT referral sessions, Core Web Vitals issues, valid schema errors.
- Always segment brand/nonbrand and mobile/desktop; set baseline AFTER launch. Sample rank on neutral locale/device and record date because SERPs vary.
- AI visibility sample: a fixed set of 20-30 buyer questions; note source link/citation frequency and competitors manually, with limits of personalization and volatility.
- Review targets monthly; adjust keyword targets after research and live baseline rather than inventing a starting rank.

## Rule 9: Build & publishing gates
A. Developer pre-merge: SEO lint/structural test, semantic HTML, metadata, canonicals, internal link check, security and accessibility checks.
B. Product publish: verified SKU, actual price/availability, image provenance, title/H1, variant URLs, schema, size and return information.
C. Article publish: original non-commodity contribution, reviewed claims, links to product/category where helpful, byline/updated date, unique editorial photography.
D. Launch: crawlers not blocked, real domain SSL and redirects, sitemap, Search Console property, staging noindex, payment and analytics real tests.
E. After launch: weekly indexing/CTR queries, monthly content audit and AI visibility sampling.
The file scripts/check-seo-governance.mjs provides an initial *structural* repository test only. It cannot replace rendered-page integration tests, manual editorial review or real Search Console monitoring.

## Primary sources verified on adoption
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/structured-data/product-variants
- https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://support.google.com/webmasters/answer/16984139
- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
