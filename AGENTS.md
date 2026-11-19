# DARMA: binding instructions for coding agents

READ BEFORE EDITING:
- design/APPROVED_VISUAL_SPEC.md (user-approved composition; do not redesign)
- seo/SEO_GEO_CONSTITUTION.md (non-negotiable SEO + AI crawlability)
- seo/seo-governance-policy.json (machine-readable standards)
- .github/PROJECT_RULES.md (owner constraints)

Run and pass:
npm run seo:static
npm run typecheck
npm run build
npm run seo:smoke

Changes must preserve original editorial composition and genuine product truth. The owner explicitly superseded the old palette on 2026-11-19 with Mocha Elegance (see app/theme-tokens.css); preserve that new palette. Every newly added page must meet the SEO checklist, mobile accessibility and content uniqueness standards. Do not fabricate prices, ratings, offers or claims. Production must not be indexed until real content, purchase and legal checks are complete.

A GitHub branch RULESET must additionally require this CI check, pull requests, code owner review and restrict direct/force push. CODEOWNERS and the workflow alone do not block direct commits.

Owner-approved 2026-11-19 visual revision: apply Mocha Elegance palette sitewide, keep photo assets and content untouched. Required additional QA: npm run theme:audit && npm run theme:responsive (Chromium). Avoid announcing cart/checkout/payments as live.
