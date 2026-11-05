# DARMA storefront roadmap and launch gates

Status 2026-11-05: repository reset to approved design/SEO/image-generation specification. No site build or deployment has been performed.

## Phase A — reference lock DONE / awaiting screenshot binary
- Old code preserved on backup/pre-editorial-redesign-2026-11-05.
- New main contains only authoritative project guidelines and plans.
- Next: add the FINAL approved screenshot to repository and check pixel sample/cropping on dev pages.

## Phase B — SEO strategy / catalog definitions
- Verify actual stock and sellable product types, size chart M/L/XL/XXL/XXXL and prices independently.
- Separate garment model from pack count and size/color variants; use stable SKUs.
- Confirm category names only if real sellable inventory; keyword demand and competitor analysis still needed.
- Draft unique product/category copy and blog pillar briefs.
- Set SSR, metadata, schema, sitemap, canonical, robots, accessibility and performance architecture before implementation.

## Phase C — photography
- Use prompts in design/IMAGE_GENERATION_PROMPTS.md.
- Generate/examine one image at a time against approved master.
- Never pass AI garments/fictional packaging as real inventory; require actual product reference photography for production authenticity.

## Phase D — website engineering
- Evaluate Next.js App Router + TypeScript with a real commerce/catalog backend.
- Desktop pixel-comparison to approved master plus mobile art direction before any feature expansion.
- Functional search, variants by M–XXXL, color/pack count, accurate price, inventory, cart, payment, customer account, delivery, return information, contact.
- Avoid generic Shopify/WooCommerce-style storefront grids.
- Verify security, input validation, idempotent payment callbacks, access control, CSRF/session/cookie protections, backups, rate limits and admin audit.
- Never place credentials in public repo or client source.
- Keep preview/staging noindex.

## Phase E — launch on darmawear.ir
- Verify domain ownership, registrar/DNS access and authoritative nameservers; not presumed.
- Decide hosting and deployment topology; no DNS change before origin is ready.
- Configure apex vs www canonical and HTTPS certificate, redirect rules, HSTS only when safe, production env vars.
- Test from Iran, mobile networks, alternate DNS, SSL, checkout, payment callbacks, inventory changes, transactional communications, delivery and returns.
- Use real address/maps/contact, valid policies and working payment.
- Submit live sitemap to Google Search Console after launch; monitor indexing and real Core Web Vitals.
- Build rollback plan: release tags, backup DB + assets, blue/green or rollback-capable release.

## Open decisions (must be resolved before production)
- Site hosting/provider; payment gateway; shipping carrier and prices; taxes/invoicing; inventory API source.
- Real company contact info and office location for Maps; social links.
- Domain DNS and access authorization.
- Legal rights to model shots and photographer assets.
- User-approved final screenshot file committed to repo.
- Promotions, verified bestseller stats/review claims and active pricing.
