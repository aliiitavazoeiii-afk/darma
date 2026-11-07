#!/usr/bin/env node
// Strict DARMA source-code SEO contract checks. Live content and rank still require auditing.
import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
const read = (file) => fs.readFileSync(file, "utf8");
const bad = (msg) => { throw Error("SEO RULE VIOLATION: " + msg); };
const needFile = (file) => { if (!fs.existsSync(file)) bad("Missing: " + file); };
const need = (file, regex, why) => { needFile(file); if (!regex.test(read(file))) bad(why + " (" + file + ")"); };
for (const file of [
 "app/layout.tsx","app/robots.ts","app/sitemap.ts","app/page.tsx",
 "lib/catalog.ts","lib/metadata.tsx","seo/SEO_GEO_CONSTITUTION.md",
 ".github/CODEOWNERS",".github/pull_request_template.md",
 "design/APPROVED_VISUAL_SPEC.md","design/ASSET_MANIFEST.md",
 "scripts/seo-smoke.mjs"
]) needFile(file);
need("lib/site.ts", /https:\/\/darmawear\.ir/, "Canonical domain may not change");
need("package.json", /release-guard\.mjs && next build/, "Production build must be gated by release guard");
need("scripts/release-guard.mjs", /NEXT_PUBLIC_SITE_LIVE/, "Release guard missing");
need("app/layout.tsx", /<html\s+lang="fa"\s+dir="rtl">/, "Persian RTL required");
need("app/layout.tsx", /metadataBase/, "Metadata base missing");
need("app/layout.tsx", /SITE_LIVE/, "Noindex deployment toggle missing");
need("lib/metadata.tsx", /alternates:\s*\{\s*canonical:/, "Route-level canonical missing");
need("app/robots.ts", /OAI-SearchBot/, "Explicit AI search crawler policy missing");
need("app/robots.ts", /Googlebot/, "Googlebot policy missing");
need("app/robots.ts", /!SITE_LIVE/, "Staging must block public crawling");
need("app/sitemap.ts", /if\s*\(!SITE_LIVE\)\s*return\s*\[\]/, "Staging sitemap must be empty");
need("app/sitemap.ts", /collection\.ready/, "Only reviewed categories may be in sitemap");
need("app/sitemap.ts", /publishedProducts/, "Only real published products may be indexed");
need("app/product/[slug]/page.tsx", /ProductGroup/, "ProductGroup variants missing");
need("app/product/[slug]/page.tsx", /priceCurrency":\s*"IRR"/, "Structured currency must be IRR");
need("app/page.tsx", /JsonLd/, "Machine-readable brand entities missing");
need("app/page.tsx", /Organization/, "Organization brand entity missing");
need("app/page.tsx", /WebSite/, "WebSite brand entity missing");
need("app/page.tsx", /hero-desktop\.webp/, "Approved real hero asset must be referenced");
need("app/page.tsx", /fetchPriority="high"/, "Hero LCP must request high priority");
need("app/globals.css", /\.hero--product/, "Approved white-brief hero styling must exist");
need("app/globals.css", /\.collections__slats/, "Approved slanted collections must remain");
need("app/globals.css", /\.daily__visual/, "Approved editorial daily deal must remain");
need("app/globals.css", /\.bestseller__stage/, "Approved editorial bestseller must remain");
needFile(".env.example");
need(".dockerignore", /!\.env\.example/, "Docker build must include .env.example required by SEO checks");
if (read(".env.example").includes("NEXT_PUBLIC_SITE_LIVE=true")) bad("Default indexing must remain disabled");
function pages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const file=path.join(dir,entry.name);
    return entry.isDirectory()?pages(file):entry.name==="page.tsx"?[file]:[];
  });
}
for(const file of pages("app")){
  const source=read(file);
  if(!/<h1\b/.test(source)) bad("Missing H1: "+file);
  if(file!=="app/page.tsx"&&!/generateMetadata|export const metadata/.test(source)) bad("Dedicated metadata required: "+file);
  if(/href=["']#["']/.test(source)) bad("Dead placeholder link: "+file);
}

// Approved real DARMA hero artwork lock: assets must be in the repository, not manually supplied on the server.
for (const media of ["public/media/hero-desktop.webp", "public/media/hero-mobile.webp"]) {
  needFile(media);
  const hex = createHash("sha256").update(fs.readFileSync(media)).digest("hex");
  if (hex !== "66cfb4f1703070afff1c2e6343ba3ccc93ebc3e820ac0a0c8f9731317bc4e94f") bad("Approved hero image changed or missing: " + media);
}

// Standalone fresh-VPS installation contracts: keep startup and staging SEO safety enforced.
for (const file of ["deploy/install-fresh.sh", "deploy/compose.fresh.yml", "deploy/Caddyfile.fresh"]) needFile(file);
need("deploy/compose.fresh.yml", /"80:80"/, "Public HTTP port mapping missing on fresh VPS.");
need("deploy/compose.fresh.yml", /"443:443"/, "Public HTTPS port mapping missing on fresh VPS.");
need("deploy/Caddyfile.fresh", /X-Robots-Tag.*noindex/, "Staging must be noindex at the proxy.");
need("deploy/install-fresh.sh", /NEXT_PUBLIC_SITE_LIVE=false/, "Fresh-VPS deploy must not index incomplete catalog.");
// Preserve future production launch guard and approved product image checksum contract.
need("deploy/install-fresh.sh", /HERO_SHA=/, "Verified approved hero asset required.");


// Headless Studio may only supply content. Protected design markup and SEO remain in Next.js.
need("app/page.tsx", /getCmsHome/, "Homepage must SSR the approved editorial CMS content");
need("app/page.tsx", /force-dynamic/, "Homepage must update without rebuild when content changes");
need("lib/cms.ts", /cache:"no-store"/, "CMS data must not be frozen in static HTML");
need("app/api/media/[id]/route.ts", /isApprovedHomepageImage/, "Media must be allowlisted before streaming");
need("app/api/media/[id]/route.ts", /Content-Security-Policy/, "CMS media responses must be sandboxed");
need("deploy/compose.fresh.yml", /cms-db:/, "Private CMS database service missing");
need("deploy/compose.fresh.yml", /cms_uploads:/, "Persistent CMS upload volume missing");
need("deploy/compose.fresh.yml", /\.env\.store/, "Private server-only CMS read token missing");
need("deploy/Caddyfile.fresh", /admin\.darmawear\.ir/, "Separate secure admin hostname missing");
need("deploy/Caddyfile.fresh", /noarchive/, "Private management panel must never be indexed");
needFile("cms/smoke.mjs");
need("cms/bootstrap.mjs", /darma_orders/, "Order management schema missing");
need("cms/bootstrap.mjs", /darma_variants/, "Variant pricing schema missing");
need(".dockerignore", /backups\//, "CMS database backups must be excluded from Docker builds");

console.log("DARMA STRICT SEO SOURCE CHECK: PASS");
