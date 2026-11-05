# DARMA: enforced SEO change and production protection

## GitHub protected main: IMPORTANT OWNER-ONLY SETUP
The GitHub connector can write code, workflows and CODEOWNERS but **cannot enable or update branch rulesets**. As of 2026-11-05, the ruleset API returned an empty list, so there is no confirmed active branch protection. Until the owner enables it, direct pushes can bypass PR review even when Actions tests exist.

To enforce this:
1. Open https://github.com/aliiitavazoeiii-afk/darma/settings/rules
2. Select **New ruleset → New branch ruleset**.
3. Give it a name such as "DARMA protected main"; set Enforcement status **Active**; target branch **main**.
4. Require a pull request before merging; require resolving conversations. Use code-owner review only if another eligible reviewer exists (the author cannot approve their own PR).
5. Require status check **seo-governance** (GitHub Actions workflow "DARMA SEO and build quality gate"). Make it mandatory.
6. Block force-pushes and branch deletions. Disable bypass where permitted.
7. Save and verify that a deliberately failing test in a PR cannot merge.

## Test enforcement
- CI runs on main pushes and all Pull Requests.
- Main quality job: seo-governance, containing source policy, TypeScript, build and HTTP-rendered smoke tests.
- If status checks are not required by a ruleset, GitHub Actions failures alone DO NOT stop a direct main push.
- Codeowner pattern covers app/, lib/, design/, seo/, workflow scripts and AGENTS.
- Manual review still required for all text, visuals, schema visibility, authentic product imagery, WCAG and local performance.

## Launch guard
Even a passing CI is NOT enough for public launch. Before a Next.js build with NEXT_PUBLIC_SITE_LIVE=true, scripts/release-guard.mjs fails unless all deploy attestations and mandatory actual product assets/policy pages are present. Attestation flags are the owner's recorded assertions, not independent proof.

Required flags set to YES (deploy-time only, never commit secrets): DARMA_OWNER_APPROVED_LIVE, DARMA_REAL_CATALOG_VERIFIED, DARMA_PRODUCT_ASSETS_APPROVED, DARMA_CHECKOUT_TESTED, DARMA_PAYMENT_CALLBACK_TESTED, DARMA_SHIPPING_RETURNS_APPROVED, DARMA_CONTACT_ADDRESS_VERIFIED, DARMA_SEO_LIVE_AUDIT_PASSED.

Real payment, inventory, accurate contact and returns/shipping information, license-cleared editorial imagery, DNS and SSL, sitemap/robots and final Google Search Console checks must be verified. Once the checklist is ready, set NEXT_PUBLIC_SITE_LIVE=true only for audited production.

## Why both code & branch rules are needed
Developers can accidentally remove tests in a single commit unless independent GitHub branch rules require review and passing checks. Site speed, schema truthfulness and AI visibility cannot be established solely by source file regex checks.

## SEO source documentation
- seo/SEO_GEO_CONSTITUTION.md
- seo/FIVE_MONTH_EXECUTION.md
- scripts/seo-policy-test.mjs
- scripts/seo-smoke.mjs
