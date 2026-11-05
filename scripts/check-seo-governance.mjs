#!/usr/bin/env node
// DARMA structural SEO policy gate. This is NOT a crawler, Lighthouse or semantic audit.
import fs from 'node:fs';
const exists = p => fs.existsSync(p);
const requiredDocs=[
'seo/SEO_GEO_CONSTITUTION.md',
'seo/FIVE_MONTH_EXECUTION.md',
'seo/seo-governance-policy.json',
'design/APPROVED_VISUAL_SPEC.md',
'design/tokens.json',
'.github/PROJECT_RULES.md'
];
const errors=[];
for (const p of requiredDocs) if(!exists(p)) errors.push('Missing governance document: '+p);
const policy=JSON.parse(fs.readFileSync('seo/seo-governance-policy.json','utf8'));
if(policy.primaryOrigin!=='https://darmawear.ir') errors.push('Production origin is not locked to darmawear.ir');
if(!policy.allowedSearchCrawlers.includes('OAI-SearchBot')) errors.push('AI discoverability crawler policy missing');
if (exists('package.json')) {
  for (const p of policy.requiredProductionFiles) if (!exists(p)) errors.push('Missing required production SEO file: '+p);
  if(exists('app/layout.tsx')) {
    const layout=fs.readFileSync('app/layout.tsx','utf8');
    if(!/\blang\s*=\s*["']fa["']/.test(layout)) errors.push('Layout must set html lang="fa"');
    if(!/\bdir\s*=\s*["']rtl["']/.test(layout)) errors.push('Layout must set RTL direction');
    if(!/\bmetadata\b|\bgenerateMetadata\b/.test(layout)) errors.push('Layout must expose Next.js metadata or generateMetadata');
  }
  if (exists('app/robots.ts')) {
    const robots=fs.readFileSync('app/robots.ts','utf8');
    if(!/sitemap/i.test(robots)) errors.push('robots.ts must reference sitemap');
  }
  if (exists('app/sitemap.ts')) {
    const sitemap=fs.readFileSync('app/sitemap.ts','utf8');
    if (!/https:\/\/darmawear\.ir|metadataBase|BASE_URL|SITE_URL/.test(sitemap)) errors.push('sitemap.ts must use the declared canonical origin');
  }
} else console.log('DARMA SEO gate: documentation-only mode; storefront has not yet been scaffolded.');
if (errors.length) {
  console.error('DARMA SEO GOVERNANCE FAILED:\n'+errors.map(s=>'- '+s).join('\n'));
  process.exit(1);
}
console.log('DARMA SEO structural governance PASS (does not certify production SEO, rankings or AI visibility).');
