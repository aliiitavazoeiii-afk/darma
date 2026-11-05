#!/usr/bin/env node
// Strict DARMA source-code SEO contract checks. Live content and rank still require auditing.
import fs from "node:fs";
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
need("app/globals.css", /\.collections__slats/, "Approved slanted collections must remain");
need("app/globals.css", /\.daily__visual/, "Approved editorial daily deal must remain");
need("app/globals.css", /\.bestseller__stage/, "Approved editorial bestseller must remain");
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
console.log("DARMA STRICT SEO SOURCE CHECK: PASS");
