# DARMA — immutable visual decisions

Status: EDITORIAL COMPOSITION APPROVED 2026-11-05; owner directly approved a NEW visual palette on 2026-11-19 (Mocha Elegance). Do not introduce further redesigns without a new owner request.

1. The LAST approved image from chat is source of truth. The repository currently documents that screenshot; the binary still requires a separate upload.
2. Design is cinematic / editorial / luxury boutique. Not generic e-commerce, not WordPress-y.
3. Preserve the REAL white DARMA underwear hero imagery, centered uppercase editorial DARMA serif in nav, oversized DARMA overlay, product-photo composition and sparse outlines. The user REPLACED rose accents with espresso #49362F, mocha beige #C7AD96, and strictly limited sage #788779. Light neutrals: #F8F5F0 and #FFFCF8; secondary text #766D66.
4. Preserve section shapes and order: hero / benefits / daily-deal split / Digikala spotlight / slanted collections / magazine / integrated brand-story footer.
5. Preserve original proportions/section order, but use the 2026-11-19 Mocha Elegance semantic palette in app/theme-tokens.css and design/tokens.json. The newer palette decision supersedes the previous screenshot colors.
6. Do NOT replace editorial structures with product-card carousels, round pill cards, repeated four-up boxed layouts, large icon tiles, generic banners or unapproved new sections.
7. Persian RTL interface. The Latin brand name and English editorial eyebrows use properly isolated LTR typography.
8. Responsive adaptations should preserve cinematic hierarchy and visual relationships, not stack everything as identical cards.
9. Product representations must reflect real DARMA catalog. Do not invent bras, reviews, user counts, prices or product claims.
10. Hero/model/pack shots are creative references until approved original licensed or user-owned final assets are ready. Avoid celebrity likenesses and third-party trademarks in assets.
11. Storefront may not go live with mockup copy, fictional numbers, fake Google Maps pins or unverified promotions.
12. SEO, accessibility, performance, checkout trust, image optimization and mobile are release blockers.
13. Old site source was intentionally replaced after an archival branch. Do not bring it back as styling scaffolding.
14. Deploy domain darmawear.ir only after ownership, DNS, host, certificates and checkout flows are verified.

## Mandatory SEO and AI discoverability constitution

EVERY implementation, page, product, blog post, campaign and release MUST comply with [seo/SEO_GEO_CONSTITUTION.md](../seo/SEO_GEO_CONSTITUTION.md) and [seo/seo-governance-policy.json](../seo/seo-governance-policy.json). This applies alongside and without changing the user's approved visual design.

The CI job .github/workflows/seo-governance.yml enforces initial file/metadata scaffold requirements only, not real search eligibility. Production must also pass manual and rendered-page checks documented in the SEO constitution. The 4-5 month goal begins after actual public indexable launch; search rank and AI inclusion are never guaranteed.

## Explicit newer approval — 2026-11-19
- User requests **whole-site** Mocha Elegance color redesign in this existing Next.js repository.
- Primary: espresso and mocha. Neutral warm-white/cream surfaces allow products room to breathe.
- Sage is an accent only (about 5%): positive stock, tiny editorial details and focused UI,
  with accessible deep-sage text on pale backgrounds when needed.
- Protect images, copy, CMS, verified product/prices, SEO/canonical/robots and all existing routes.
- Preserve hero-font selector and owner-uploaded editorial images.
- Commerce checkout/cart still not live in this preview; do not fabricate completion.
- CSS changes must pass `npm run theme:audit`, responsive Chromium screenshots,
  the existing SEO/typecheck/production build/SSR/CMS tests.
