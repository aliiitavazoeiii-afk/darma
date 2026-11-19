# DARMA — approved home visual blueprint

## Source of truth and scope
The original editorial layout was approved on 2026-11-05. On 2026-11-19 the owner explicitly superseded **only the visual color identity** with **Mocha Elegance**. Preserve layout, real photos, CMS content, product prices, URLs and technical/SEO architecture.
This document preserves the screenshot's layout logic. The composition of the previously approved design remains authoritative, but the owner’s later Mocha Elegance palette overrides its former rose/mauve palette. The binary screenshot is in the ChatGPT conversation at a_cinematic_high_end_fashion_e_commerce_homepage.png (1024x1536) and should be copied into the repo separately.

No framework/theme should dictate the layout. Build unique components. Directus is a separate content backend, not a theme editor.

## Visual identity
- Atmosphere: boutique, minimalist, editorial, intimate, premium, warm and serene — not a mass-market WordPress storefront.
- Light: natural warm contrast. The photography stays original; no replacement image or recoloring of owner-supplied product photography. Avoid flashy gradients and heavy shadows.
- Palette (current): espresso **#49362F** and mocha beige **#C7AD96** dominate; warm cream **#F8F5F0** and warm white **#FFFCF8** keep the layout light. Sage **#788779** is a ≤5% accent, with **#415343** for accessible small green text. Secondary text **#766D66**. The code source of truth is `app/theme-tokens.css` mirrored in `design/tokens.json`.
- Photography: tactile fabrics, sculptural draping, rich shadow gradations, real texture; reserve generous negative space for typography.
- Typography: DARMA logotype in high-contrast thin serif with extreme uppercase tracking. Small English editorial labels: widely tracked uppercase. Persian: elegant readable modern sans with confident display weight; do not use decorative calligraphy for interface copy.
- UI: hairline separators, very restrained outline CTA, minimum decorations. Subtle radii only where reference displays them. No generic boxed cards.
- Desktop reference is 1024x1536 long page; adapt ratio and hierarchy to larger screens. At mobile widths preserve editorial choreography.

## Page composition (DO NOT REORDER)
### 01 Header integrated with hero
Transparent/dark header over hero, DARMA brand centered, utility search/cart/favorite/user icons aligned left, right-side RTL nav: محصولات، پرفروش‌ها، جدیدترین‌ها، مجله دارما، درباره ما.
Thin low-contrast bottom line. No announcement bar and no sticky white WordPress nav by default.

### 02 Hero — revised owner approval 2026-11-07
The latest approved main banner is the user's own white DARMA underwear product photographed on a warm ivory/cream backdrop, not a model. It is committed as `public/media/hero-desktop.webp` and `hero-mobile.webp` and is the protected fallback for the storefront.
Preserve the current RIGHT-side product composition and LEFT-side editorial HTML overlay: small spaced PREMIUM UNDERWEAR, large DARMA serif logotype, Persian line and narrow outline CTA. Three unobtrusive pagination dots are visual styling only; do not invent a working slider.
The CMS may swap the photographic backdrop and the selected copy, but NEVER rewrite the layout, palette, CSS, navigation or logo. Photos must accurately depict authentic DARMA products, not fabricated inventory or a different garment style.

### 03 Benefits strip
Across the width directly below hero. Translucent deep-coffee glass/overlay, very fine dividers, thin-line icons + small Persian text: پارچه باکیفیت، راحتی روزانه، ماندگاری بالا، ارسال سریع. Claims subject to validation. Not separate white cards.

### 04 DAILY DEAL
Wide full-bleed editorial split: close-up rose lace underwear atop silk with small pale petals on LEFT; a pale dusty-blush curved edge / diagonal organic division from soft rose to warm pink on RIGHT.
Right: narrow tracked DAILY DEAL, large Persian "تخفیف ویژه امروز", short subline, THREE tasteful timer units in translucent thin-border rounded rectangles, one deep muted-rose CTA. This is a bespoke luxury campaign, not an ordinary promo card.
Timer must be real, expiration-controlled server side, hidden gracefully if no deal; no fictitious discount.

### 05 DIGIKALA spotlight
Full-width espresso/mauve photography panel. Left-column English tracked BESTSELLER ON DIGIKALA, Persian heading and a few lines, understated outlined CTA.
Giant translucent thin-serif "No.1" across the left-center; the primary authentic DARMA multi-pack of folded briefs displayed on a low smooth podium at the right-center. Right-side verified social proof may be incorporated only if factual; otherwise use clean composition without invented stats.
Never render 4 or 5 equal-sized product cards here. Title + podium composition is critical.

### 06 COLLECTIONS
Cream/ivory transition. Right-column editorial heading "COLLECTIONS" and "مجموعه محصولات دارما". To its left, four highly unusual narrow photographic strips with diagonal/slanted parallel edges, not a grid of cards. Close-up tactile real fabric/garment images in black lace, dusty rose textile, dark navy folded cloth, ivory lace. Persian collection labels are overlaid at each strip base.
Category names must match live catalog; currently conceptual: مدل‌های توری، مدل‌های ساده، پک‌های اقتصادی، مدل‌های راحتی.

### 07 MAGAZINE
Off-white editorial band, with a compact left title column containing tracked MAGAZINE, "مجله دارما", one-line description and small outlined CTA.
Three panoramic article image tiles aligned horizontally to the right, gently rounded only: soft fabric in water / cotton material macro / warm lifestyle on bed. Minimal overlaid Persian headlines; no WordPress-style article metadata and no stock blog card grids.
Editorial content: selecting size, fabric knowledge, washing care. Text published only after factual review.

### 08 Footer + brand story
One cohesive cinematic muted-mauve/soft landscape backdrop. The lower section integrates:
- a genuine location map panel only after real address verification (use real Maps embed/API, not AI-generated map illustration);
- discreet support, shipping, guarantees, and genuine contact links;
- a vertical divider; a restrained about-DARMA statement; large airy DARMA logotype and social icons.
Placeholders must never become public contact or map data.

## Responsiveness and accessibility
- RTL document direction; isolate English values and numbers appropriately.
- Respect safe areas, real keyboard navigation and focus indications.
- Visual contrast around copy on photography; use gradients only where necessary for legibility.
- Mobile hero may crop differently but subject and editorial balance must survive; photo focal coordinates documented in asset manifest.
- Mobile collection strips can become horizontal swipeable slanted panels, not stock cards.
- Images have useful alt text when informative and empty alt when decorative.

## Rejected aesthetics
White template-style navbar; repeated "new arrivals" grids; generic 4-column equal-size cards; basic rounded sale rectangles; square CMS post cards; conspicuous excessive icons; Elementor or Woodmart copy; flat sterile gray background; neon pink; arbitrary badges; bogus numeric social proof.

## Asset lock
Source raster: the last approved generated screenshot, not earlier drafts.
Until source image is committed, pixel-perfect matching cannot be independently verified from this repository alone. Do not claim exact visual parity without side-by-side screenshot review.

## Independent editing panel — explicit boundaries (2026-11-07)
- `admin.darmawear.ir` is a password-protected content/commerce editing surface.
- Editors can change campaign photos and plain-text copy in fixed slots, plus metadata and draft product records.
- ONLY GitHub PRs with the mandatory SEO check may change JSX components, CSS layout, typography, color tokens, cart/checkout code or schema contracts.
- The page's ordered sections and branded editorial appearance are locked even if the CMS database is reset or offline; safe defaults stay in code.
- Pricing/order collections are prepared for commerce integration but do not imply a connected payment gateway or live customer orders.
- Never give editor-supplied HTML/script/style strings direct rendering or publish invented discounts, stock counts, ratings or prices.

## 2026-11-19 — Mocha Elegance implementation boundary
The owner explicitly requests a full **visual color redesign** of the current DARMA repository, not a new theme or changed commerce functionality.
The authoritative palette and semantic CSS tokens are located in `app/theme-tokens.css`;
`design/tokens.json` mirrors the brand base swatches. Rough visual guidance:
50% light neutrals, 25% espresso, 20% mocha and 5% sage.
- Important: all existing URLs, DOM section order, customer-facing copy, image files,
  CMS-uploaded photos, products, SKUs and verified prices remain unchanged.
- Primary actions are espresso with warm-white text; alternate actions are espresso outlines.
- Sage #788779 is **not** sufficient for ordinary small text on warm white: use
  accessible dark sage #415343 when green conveys stock/positive state.
- Existing hero photo and editor-selectable Persian hero font are unchanged.
- No new cart/checkout/payment flow is invented: these parts are not currently live.
- Use semantic hover/active/focus/disabled tokens; never fall back to rose/magenta
  fills or loud green primary CTAs.
- Build, SSR SEO, CMS integration, true browser viewport and AA token audits gate release.
