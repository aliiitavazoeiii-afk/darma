# DARMA Studio — independent content and commerce admin

## Purpose and scope
The existing store at https://darmawear.ir retains the exact owner-approved layout,
colors, spacing, editorial sections and GitHub SEO release gates. The admin is a
**separate application** at https://admin.darmawear.ir/admin deployed on the SAME VPS,
with a separate Postgres database and persistent upload volume.

The Studio is provided by pinned Directus 12.6.1, **not WordPress**. No templates,
plugins or arbitrary HTML/CSS editors can modify the public Next.js page.
Editor changes to the approved fields appear on the homepage automatically through
server-side rendering. No direct admin API token reaches the browser.

## Editable areas

| Directus collection | What the owner can change |
| --- | --- |
| darma_content | Hero caption/button and two photos; Daily Deal heading/copy/photo; Digikala Spotlight heading/copy/photo; collections and magazine heading/copy |
| darma_categories | Names and photos for four editorial collection slots, while preserving fixed URLs and diagonal editorial design |
| darma_articles | Published magazine teaser titles, short summaries and three editorial images |
| darma_products | Verified product records and real product images; draft/published flags (catalog integration phase) |
| darma_variants | SKU, size, color, pack count, price **entered in Toman**, verified stock; storefront converts to IRR for Schema.org and displays Toman |
| darma_orders | Manual order record tracking; checkout is NOT integrated |
| darma_order_lines | Manually entered order lines; automatic checkout synchronization is NOT integrated |

The public homepage currently fetches its copy and approved editorial photography
from CMS on every server request, with fallback to existing GitHub-defined text/image
when CMS is down. Product records explicitly marked **published + verified**, with a nonempty title,
description, and at least one enabled price/stock-verified SKU, appear on
the `/shop` and `/product/<slug>` pages automatically, without a rebuild.
Each variant price entered in `price_toman` overrides optional API-level
`price_irr` and is converted x10 for IRR structured data. Unverified
products/variants never become public. The checkout and payment flow remain
DISABLED. Order tables are manual/admin-only until a tested checkout exists.

### Images: uploading and replacing
Log in -> Files -> Upload image -> open `darma_content` -> select the relevant
`*_image` field -> choose the uploaded image -> Save. The public site image
proxy only serves UUIDs referenced in approved homepage settings, visible
categories, and published magazine teasers. All other files remain private.
Allowed image MIME types: PNG, JPEG, WebP, AVIF, GIF. Upload limit: 25 MB.

The historical owner-approved white brief hero remains as the fallback image.
Replacing the hero from Studio does not change its desktop/mobile composition,
text overlay, typography or site layout.

### Editing and SEO
- Text is escaped and rendered server-side; no CMS HTML can inject markup.
- Layout/CSS/typography system stays versioned in GitHub; brand palette is locked.
- The storefront currently runs in noindex preview mode. Removing this requires
  actual products, payment tests, shipping/return policies and release attestation.
- No product, order, price, stock, rating, discount percentage, or payment
  information is invented in seed data.

## New-VPS installation/update
When the reviewed PR is on `main`, on the already-running `darmashop` server:

```bash
cd /opt/darmawear-store && git fetch origin main && git checkout main && git merge --ff-only origin/main && bash deploy/install-fresh.sh
```

The installer creates random initial admin secrets in a root-only `.env.cms`,
and a server-only storefront read token in `.env.store`. They are **not** on GitHub.
The initial admin login credential is saved only to the root-readable file:

```bash
cat /root/darmawear-admin-first-login.txt
```

Do NOT paste credentials into ChatGPT or public GitHub issues. Change the initial
admin email to your real inbox and change password immediately inside Directus;
enable two-factor auth. SMTP must be configured separately for email recovery.

## One external DNS prerequisite
Add an `A` record for `admin.darmawear.ir` pointing to the same VPS IPv4 as
`darmawear.ir` (currently `45.142.189.66`). If that changes, point to the actual
new IP; do not hardcode it in application code. The existing Caddy container
then obtains an independent HTTPS certificate automatically.

## Safety, persistence, recovery
- The `cms-db` PostgreSQL service has no externally published database port.
- The `cms` Directus container has no externally published 8055 port.
- Only Caddy exposes HTTPS and proxies `admin.darmawear.ir` to private `cms:8055`.
- Each subsequent update runs additive schema checks and backs up PostgreSQL
  into `/opt/darmawear-store/backups` before changes.
- **Important:** PostgreSQL backups alone do not contain uploaded image binaries.
  Separately back up the Docker volume `darmawear-store_cms_uploads`. Do not
  use `docker compose down -v` on the production VPS: it would destroy data.
- Failed admin startup/bootstrapping halts installer before any public site
  rebuild; existing storefront container should continue serving the last
  healthy version.
- For current container status:

```bash
cd /opt/darmawear-store
docker compose -p darmawear-store -f deploy/compose.fresh.yml ps
docker logs darmawear-admin --tail 60
```

## Future feature integration
A verified checkout, order item snapshots, payment callback idempotency,
inventory reservation, shipping, refunds, and customer notifications must be
designed and tested before any real transaction is accepted. That will use
separate GitHub PRs with comprehensive payment and SEO tests.

Directus licensing should be assessed against the intended business use.
Its current self-hosted Core tier and Open Innovation Grant conditions:
https://directus.com/docs/self-hosting/overview

## Editing real catalog prices (example; no fictional catalog rows created)
1. Open **محصولات دارما**, create a real product with unique lowercase Latin slug,
   verified description/image, set `verified=true` and `status=published`.
2. Open **تنوع و قیمت‌ها**, add a matching `product_slug` with exact same slug,
   its real `sku`, `size`, `color`, and `pack_count`.
3. Enter `price_toman` as an integer amount in Toman (e.g., 670000 if that
   is actually your verified selling price), `stock_qty` as real pieces
   available and explicitly check `price_verified`, `stock_verified`, `enabled`.
4. Save. The SSR shop will display the real verified product and price; all
   public product pages and media still carry `noindex` in preview mode.
5. Order collections are currently manual record-editing only; **never accept
   live payments or customer orders on this preview**.

Do not publish placeholders, invalid stock, scraped third-party prices or
reviews, or invent available SKUs. Use true catalog data after owner approval.

## Persian hero typography selector (self-hosted, no CDN)
Go to **مدیریت صفحه اصلی** -> **فونت متن فارسی هیرو**, choose from 16
real open-licensed families (Vazirmatn, Estedad, Noto Sans Arabic, Noto Naskh
Arabic, Cairo, Readex Pro, Markazi Text, El Messiri, Changa, Baloo Bhaijaan 2,
Reem Kufi, Lalezar, Almarai, Tajawal, Amiri, IBM Plex Sans Arabic).
Save, and reload `https://darmawear.ir`. The selected font changes ONLY the
Persian subtitle under the DARMA hero logotype; all existing layout, sizes,
colors, logo and navigation remain code-locked. Choosing **بدون تغییر** preserves
the existing system font. Actual font files are self-hosted via @fontsource,
not loaded from a third-party CDN.

**Kalameh**, IRANSans, Yekan Bakh and similar commercial fonts are not bundled
or shared in this GitHub repository. To use one legally, obtain a
**website/webfont** license for `darmawear.ir`, open the
**فایل فونت دارای مجوز وب (WOFF2)** field in the same singleton editor,
upload the license-authorized WOFF2 file, then choose **کلمه یا فونت خریداری‌شده**
from the selector. The file stays on the private CMS upload volume and is served
by a same-origin restricted endpoint only while selected. This is not a claim
that a commercial font license has been acquired.
