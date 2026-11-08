import heroFontManifest from "@/cms/hero-font-manifest.json";
/**
 * Server-only, read-only CMS adapter.
 * The browser never receives the CMS token or accesses draft/order APIs.
 * All strings are plain text; React escapes them. The design/layout is immutable.
 */
const endpoint = (process.env.DARMA_CMS_URL || "").replace(/\/$/, "");
const token = process.env.DARMA_CMS_TOKEN || "";
export const isImageId=(value:unknown):value is string =>
  typeof value==="string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

async function api(path:string):Promise<unknown> {
  if(!endpoint || !token) return null;
  try {
    const r=await fetch(endpoint+path,{headers:{"Authorization":"Bearer "+token},cache:"no-store",signal:AbortSignal.timeout(3500)});
    if(!r.ok) return null;
    const j=await r.json();
    return j?.data ?? null;
  } catch { return null; } // preserve existing shop fallback if CMS is restarting
}
export const privateCmsRead=api;
const heroFontIds=new Set(heroFontManifest.fonts.map(font=>font.id));
export function validatedHeroFont(value?:string, licensedId?:string):string {
  if(value==="licensed")return isImageId(licensedId)?"licensed":"original";
  return value && heroFontIds.has(value)?value:"original";
}
const obj=(value:unknown):Record<string,unknown>|null=>
  value && typeof value==="object" && !Array.isArray(value)?value as Record<string,unknown>:null;
const list=(value:unknown):Record<string,unknown>[] =>
  Array.isArray(value)?value.map(obj).filter((x):x is Record<string,unknown>=>!!x):[];
const str=(value:unknown,max=300):string|undefined=>
  typeof value==="string" && value.trim() ? value.trim().slice(0,max):undefined;
const val=(entry:Record<string,unknown>,name:string)=>str(entry[name],name.includes("text")||name.includes("subtitle")?700:200);

export type CmsHome={
  hero_eyebrow?:string;hero_subtitle?:string;hero_cta_label?:string;hero_persian_font?:string;hero_licensed_font?:string;
  hero_image?:string;hero_mobile_image?:string;
  daily_eyebrow?:string;daily_title?:string;daily_text?:string;daily_image?:string;daily_cta_label?:string;
  best_eyebrow?:string;best_title?:string;best_text?:string;best_image?:string;best_cta_label?:string;
  collections_title?:string;collections_text?:string;magazine_title?:string;magazine_text?:string;
  about_heading?:string;about_intro?:string;about_section_heading?:string;about_section_text?:string;
  contact_heading?:string;contact_intro?:string;contact_section_heading?:string;contact_section_text?:string;
  footer_about_text?:string;footer_location_text?:string;shop_page_intro?:string;magazine_page_intro?:string;
};
export type CmsCategory={slug:string;name?:string;eyebrow?:string;description?:string;image?:string;visible:boolean};
export type CmsArticle={slug:string;title:string;summary?:string;image?:string};

const contentFields=[
 "hero_eyebrow","hero_subtitle","hero_cta_label","hero_persian_font","hero_licensed_font","hero_image","hero_mobile_image",
 "daily_eyebrow","daily_title","daily_text","daily_image","daily_cta_label",
 "best_eyebrow","best_title","best_text","best_image","best_cta_label",
 "collections_title","collections_text","magazine_title","magazine_text",
 "about_heading","about_intro","about_section_heading","about_section_text",
 "contact_heading","contact_intro","contact_section_heading","contact_section_text",
 "footer_about_text","footer_location_text","shop_page_intro","magazine_page_intro"
] as const;

export async function getCmsHome():Promise<CmsHome> {
  const data=await api("/items/darma_content?fields="+contentFields.join(",")+"&limit=1");
  const record=obj(Array.isArray(data)?data[0]:data);
  if(!record) return {};
  const out:Record<string,string>={};
  for(const field of contentFields){
    const value=val(record,field);
    if(value) out[field]=value;
  }
  for(const key of ["hero_image","hero_mobile_image","daily_image","best_image","hero_licensed_font"]){
    if(!isImageId(out[key]))delete out[key];
  }
  return out as CmsHome;
}

export async function getCmsCategories():Promise<CmsCategory[]> {
  const entries=list(await api("/items/darma_categories?fields=slug,name,eyebrow,description,image,visible&limit=40&sort=sort_index"));
  return entries.flatMap(r=>{
    const slug=str(r.slug,64);
    if(!slug || !/^[a-z0-9-]{2,64}$/.test(slug))return [];
    return [{
      slug,name:val(r,"name"),eyebrow:val(r,"eyebrow"),
      description:val(r,"description"),
      image:isImageId(r.image)?r.image:undefined,
      visible:r.visible!==false
    }];
  });
}

export async function getCmsArticles():Promise<CmsArticle[]>{
  const entries=list(await api("/items/darma_articles?fields=slug,title,summary,image,status&filter[status][_eq]=published&sort=sort_index&limit=3"));
  return entries.flatMap(r=>{
    const slug=str(r.slug,64),title=val(r,"title");
    if(!slug||!title||!/^[a-z0-9-]{2,64}$/.test(slug))return [];
    return [{slug,title,summary:val(r,"summary"),image:isImageId(r.image)?r.image:undefined}];
  });
}

export function publicCmsImage(id?:string):string|undefined {
  return isImageId(id)?"/api/media/"+id:undefined;
}

// A private editor's uploads and ALL order/product attachments are private by default.
// Only media actually selected on the homepage / visible category / published story
// may be served by the storefront media proxy. No direct CMS asset access in browser.
export async function isApprovedHomepageImage(id:string):Promise<boolean>{
  if(!isImageId(id))return false;
  const [home,categories,articles,products]=await Promise.all([
    getCmsHome(),getCmsCategories(),getCmsArticles(),
    api("/items/darma_products?fields=image,status,verified&filter[status][_eq]=published&filter[verified][_eq]=true&limit=200")
  ]);
  return [home.hero_image,home.hero_mobile_image,home.daily_image,home.best_image,
    ...categories.filter(c=>c.visible).map(c=>c.image),...articles.map(a=>a.image),
    ...list(products).filter(p=>p.verified===true && p.status==="published").map(p=>isImageId(p.image)?p.image:undefined)
  ].includes(id);
}

export async function getCmsAsset(id:string):Promise<Response|null>{
  if(!endpoint||!token||!isImageId(id))return null;
  try{
    const r=await fetch(endpoint+"/assets/"+encodeURIComponent(id),{
      cache:"no-store",headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(15000)
    });
    if(!r.ok || !(r.headers.get("content-type")||"").startsWith("image/"))return null;
    return r;
  }catch{return null;}
}

export async function getLicensedHeroFontAsset(id:string):Promise<Response|null>{
  if(!endpoint||!token||!isImageId(id))return null;
  const home=await getCmsHome();
  if(home.hero_persian_font!=="licensed"||home.hero_licensed_font!==id)return null;
  try {
    const response=await fetch(endpoint+"/assets/"+encodeURIComponent(id),{
      cache:"no-store",headers:{Authorization:"Bearer "+token},
      signal:AbortSignal.timeout(12000)
    });
    if(!response.ok)return null;
    const mime=(response.headers.get("content-type")||"").split(";")[0];
    if(!["font/woff2","application/font-woff","application/octet-stream"].includes(mime))return null;
    return response;
  } catch {return null;}
}
