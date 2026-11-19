#!/usr/bin/env node
/**
 * Mocha Elegance gate. No remote calls, no font downloads.
 * Validates the SINGLE CSS token source, mirror manifest, palette consistency,
 * dark/light text contrast, and preservation of accessible responsive states.
 */
import fs from "node:fs";
import assert from "node:assert/strict";
const css=fs.readFileSync("app/theme-tokens.css","utf8");
const globals=fs.readFileSync("app/globals.css","utf8");
const layout=fs.readFileSync("app/layout.tsx","utf8");
const spec=JSON.parse(fs.readFileSync("design/tokens.json","utf8"));
const colors=spec.colors;
const swatches={
  "--brand-espresso":colors.espresso,
  "--brand-mocha":colors.mocha,
  "--brand-sage":colors.sage,
  "--brand-cream":colors.cream,
  "--brand-white":colors.warmWhite,
  "--brand-muted":colors.secondaryText,
  "--brand-sage-ink":spec.derived.sageAccessibleInk,
  "--brand-sage-pale":spec.derived.sagePale
};
for(const [name,value] of Object.entries(swatches)){
  assert.match(value,/^#[0-9A-F]{6}$/i,"Invalid color: "+name);
  assert.ok(css.includes(name+":"+value+";"),"Token mismatch between CSS and JSON: "+name);
}
const luminance=(hex)=>{
  const components=[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16)/255)
    .map(x=>x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4));
  return 0.2126*components[0]+0.7152*components[1]+0.0722*components[2];
};
const contrast=(a,b)=>{
  const [lighter,darker]=[luminance(a),luminance(b)].sort((a,b)=>b-a);
  return (lighter+0.05)/(darker+0.05);
};
const cases=[
  ["espresso text on warm white",colors.espresso,colors.warmWhite],
  ["espresso text on cream",colors.espresso,colors.cream],
  ["espresso text on mocha",colors.espresso,colors.mocha],
  ["secondary text on warm white",colors.secondaryText,colors.warmWhite],
  ["secondary text on cream",colors.secondaryText,colors.cream],
  ["primary button white-on-espresso",colors.warmWhite,colors.espresso],
  ["inverse editorial copy white-on-espresso",colors.warmWhite,colors.espresso],
  ["positive dark sage on warm white",spec.derived.sageAccessibleInk,colors.warmWhite],
  ["positive dark sage on sage-light",spec.derived.sageAccessibleInk,spec.derived.sagePale],
  ["focus ring dark sage on warm white",spec.derived.sageAccessibleInk,colors.warmWhite]
];
for(const [role,foreground,background] of cases){
  const ratio=contrast(foreground,background);
  assert.ok(ratio>=4.5,role+" must meet WCAG AA normal-text ratio 4.5:1; actual "+ratio.toFixed(2));
  console.log("WCAG_AA "+role+" "+ratio.toFixed(2)+":1");
}
assert.ok(contrast(colors.warmWhite,colors.sage)<4.5,"Sage was expected to require accessible dark-text replacement.");
const obsolete=["#AB2C4C","#D88BA2","#CFABA7","#F3EBE8","#211A19","#B59494","#992042","#BF3158"];
for(const color of obsolete){
  assert.ok(!globals.toLowerCase().includes(color.toLowerCase()),"Unconverted old color remains in CSS: "+color);
}
assert.ok(layout.includes('import "@/app/theme-tokens.css";'),"Token stylesheet must load globally");
assert.ok(layout.includes('import "@/app/globals.css";'),"Actual brand styles must load");
assert.ok(layout.includes('themeColor: "#49362F"'),"Mobile chrome theme mismatches Mocha Elegance");
for(const selector of [
  ".site-header--solid",".hero--product",".benefits",".daily",".bestseller",
  ".collections",".magazine",".site-footer",".inner-shell",".inner-hero",
  ".collection-link",".darma-product-tile",".darma-product-photo",
  ".article-topic",".story",".button--rose",".button--outline",
  ".button--dark-outline",".note-panel",".inventory-note--available",
  ":focus-visible",":disabled",":hover",":active",
  "@media (max-width:650px)","@media (max-width:920px)"
]){
  assert.ok(globals.includes(selector),"Missing themed component or responsive state "+selector);
}
assert.match(globals,/\.button--rose\{[^}]*var\(--button-primary-bg\)/,"Legacy CTA class must now use espresso, not pink");
assert.match(globals,/\.inventory-note--available\{[^}]*var\(--brand-sage-ink\)/,"Small green stock text must be accessible");
assert.match(globals,/\.collection-slat\[style\*="background-image"\]:before\{background:none\}/,"CMS images must display through slanted collection art");
assert.ok(!/#[0-9a-fA-F]{6}\b/.test(globals),"All literal brand colors must use semantic CSS tokens");
const hero=fs.readFileSync("app/page.tsx","utf8");
assert.ok(hero.includes('src={heroDesktop}')&&hero.includes('srcSet={heroMobile}'),"Do not swap real approved hero imagery");
assert.ok(hero.includes("validatedHeroFont"),"Owner's selected CMS hero font must continue working");

const sageLocations=[
 ".hero--product .hero__copy .editorial-label::before",
 ".benefits__grid>div:nth-child(2) svg",
 ".daily__message .editorial-label::before",
 ".daily__pending::before",
 ".bestseller__sidebar .editorial-label::after",
 ".collection-slat--2 .collection-slat__label svg",
 ".magazine__intro .editorial-label::before",
 ".inner-hero .editorial-label::before",
 ".collection-link:nth-child(2)::before",
 ".product-variants .note-panel[aria-current=\"true\"]",
 ".site-footer__about h2::before"
];
for(const selector of sageLocations)assert.ok(globals.includes(selector),
  "Sage accent needs a concrete visible placement: "+selector);
assert.ok(globals.includes("background:var(--brand-sage-pale)"),"Sage needs light editorial surfaces");
assert.match(globals,/\.daily__pending\{[^}]*color:var\(--brand-sage-ink\)/,
  "Accessible badge text must use dark sage, not low-contrast raw sage");
console.log("DARMA MOCHA ELEGANCE THEME / WCAG AA / RESPONSIVE CONTRACT: PASS");
