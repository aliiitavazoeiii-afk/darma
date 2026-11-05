# DARMA — Official Storefront Project

Brand: DARMA / دارما — women's underwear
Canonical future domain: https://darmawear.ir
Project status: WORKING DEVELOPMENT STORE FRONTEND (build + SEO smoke passed); campaign/product image assets, real catalog, checkout, deployment and domain NOT YET READY.

## The only approved visual direction
High-end cinematic editorial fashion / luxury lingerie boutique, based on the FINAL USER-APPROVED reference image from the 2026-11-05 conversation, not the previous COS/ARKET sketch, not standard WordPress/WooCommerce section grids.

**Do not redesign, remix, change palette, replace hero, add generic card grids, reorder approved sections or improvise banners.** If production constraints require a visual change, obtain approval first.

Visual anchor: the LAST generated mockup, titled in conversation "a_cinematic_high_end_fashion_e_commerce_homepage.png" (1024 x 1536 reference). Image exists in the chat artifact; its binary is NOT yet stored in this GitHub repository. The image, not the text alone, is the authoritative source for pixel-level decisions. Upload the reference image to design/reference/approved-homepage.png before claiming pixel-perfect implementation.


## Mandatory SEO + AI discoverability constitution (2026-11-05)
All future code, products, articles, photos, metadata and deployments MUST comply with the repository-wide [SEO + AI Constitution](seo/SEO_GEO_CONSTITUTION.md). This includes [5-month execution roadmap](seo/FIVE_MONTH_EXECUTION.md), machine-readable [governance policy](seo/seo-governance-policy.json), and initial automated [GitHub SEO policy gate](.github/workflows/seo-governance.yml).

The five-month ranking objective starts only on real public indexable launch. First-page rankings and AI recommendations are goals, not promises. No redesign of approved editorial visual identity is permitted to satisfy SEO: implement both requirements together.

## Documents
- design/APPROVED_VISUAL_SPEC.md — exact art direction and layout, visual invariants.
- design/tokens.json — sampled working color tokens (reference image is authoritative).
- design/IMAGE_GENERATION_PROMPTS.md — production photography briefs for each section.
- seo/SEO_PLAN.md — search architecture, technical SEO, structured data and editorial strategy.
- planning/IMPLEMENTATION_AND_LAUNCH.md — engineering gates and domain launch checklist.
- .github/PROJECT_RULES.md — non-negotiable rules for contributors/AI developers.

## Approved section order in FINAL mockup
1. Transparent minimal header + full-width cinematic dark HERO.
2. Thin feature strip with line icons.
3. Daily Deal split editorial campaign.
4. Digikala bestseller hero featuring a physical multi-pack.
5. Slanted-angle collections image strips.
6. Darma Magazine editorial story tiles.
7. Brand story, contact/support and genuine map in footer.

Historical wish list also mentioned a "new arrivals" box, but it is NOT present as a standalone section in the FINAL approved image. Do not insert it into the locked composition without an approved revision.

## Truth and trust
Any illustrative statistics, badges, store location, address, phone numbers, pricing, discount amounts, stock, star ratings and shipping claims in a mockup are placeholders, not verified facts. Never publish them without real source data.

## Technical direction
Preferred candidate: Next.js App Router, TypeScript, server-rendered public catalog pages, modular commerce APIs, mobile-first RTL, SEO-first. This is a proposed stack, NOT an implemented deployment. No current website is claimed.

## Recovery
Old repository content was preserved on branch backup/pre-editorial-redesign-2026-11-05 at commit f1555cc96b525add63fbce5fa206569004c6af7f before replacing the default branch tree.


## Development build — 2026-11-05
The Next.js 16 implementation is now in app/, components/, lib/; styling in app/globals.css.
Current routes: /, /shop, /shop/lace, /shop/everyday, /shop/packs, /shop/comfort, /magazine, /about, /contact. Unpublished products return a hard 404. All routes are noindex by default.

Local run with Node.js 22:
```sh
npm install
cp .env.example .env.local
npm run dev
```
Quality gate before every change:
```sh
npm run seo:static
npm run typecheck
npm run build
npm run seo:smoke
```
For release, run the separate guard (npm run release:check) with all authorized and verified production inputs. See seo/DEPLOYMENT_PROTECTION.md.

**IMPORTANT:** The Next.js code is a working *layout prototype*, not a full commerce system or approved photorealistic visual recreation. Image placeholders remain until genuine product/brand photography is added. Do not enable NEXT_PUBLIC_SITE_LIVE=true or point DNS to it yet.
