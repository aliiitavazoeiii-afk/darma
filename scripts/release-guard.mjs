#!/usr/bin/env node
/**
 * Fail-closed DARMA production release preflight.
 * Even a passing build/SEO smoke test is NOT authorization to launch.
 * The owner must verify every prerequisite and set explicit deploy-time attestations.
 */
import fs from "node:fs";
const live=process.env.NEXT_PUBLIC_SITE_LIVE==="true";
if(!live) {
  console.log("DARMA RELEASE GUARD: development/staging noindex mode. Public launch intentionally disabled.");
  process.exit(0);
}
const requiredFlags=[
  "DARMA_OWNER_APPROVED_LIVE",
  "DARMA_REAL_CATALOG_VERIFIED",
  "DARMA_PRODUCT_ASSETS_APPROVED",
  "DARMA_CHECKOUT_TESTED",
  "DARMA_PAYMENT_CALLBACK_TESTED",
  "DARMA_SHIPPING_RETURNS_APPROVED",
  "DARMA_CONTACT_ADDRESS_VERIFIED",
  "DARMA_SEO_LIVE_AUDIT_PASSED"
];
const missing=requiredFlags.filter(flag=>process.env[flag]!=="YES");
const routes=["app/shipping/page.tsx","app/returns/page.tsx","app/privacy/page.tsx","app/terms/page.tsx"];
const assets=[
 "public/media/hero-desktop.webp","public/media/hero-mobile.webp",
 "public/media/daily-deal.webp","public/media/digikala-pack.webp",
 "public/media/collection-lace.webp","public/media/collection-everyday.webp",
 "public/media/collection-packs.webp","public/media/collection-comfort.webp",
 "public/media/article-size.webp","public/media/article-material.webp",
 "public/media/article-care.webp","public/media/footer.webp"
];
for(const item of [...routes,...assets]) if(!fs.existsSync(item)) missing.push("missing "+item);
const catalog=fs.readFileSync("lib/catalog.ts","utf8");
if(!/published:\s*true/.test(catalog)) missing.push("No explicitly verified published product in catalog");
if(missing.length){
 console.error("DARMA PRODUCTION LAUNCH BLOCKED:\n"+missing.map(s=>"- "+s).join("\n"));
 process.exit(1);
}
console.log("DARMA RELEASE GUARD: declared prerequisites present. Perform final human production QA and manual domain deployment.");
