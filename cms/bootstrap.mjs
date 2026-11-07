#!/usr/bin/env node
/**
 * Idempotent, additive DARMA Studio bootstrap.
 * Runs INSIDE the Directus container with ADMIN_TOKEN. Never deletes collections,
 * changes user-entered content or creates fictional products or orders.
 */
const BASE = "http://127.0.0.1:8055";
const TOKEN = process.env.ADMIN_TOKEN;
if (!TOKEN || TOKEN.length < 32) throw new Error("CMS bootstrap token missing");
async function api(method, path, data, optional404 = false) {
  const res = await fetch(BASE + path, {
    method, headers: {Authorization: "Bearer " + TOKEN, "Content-Type": "application/json"},
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(15000)
  });
  if (optional404 && res.status === 404) return null;
  const raw = await res.text();
  if (!res.ok) throw new Error(method+" "+path+" => HTTP "+res.status+" "+raw.slice(0,450));
  return raw ? JSON.parse(raw).data : null;
}


const persianLabels={
 hero_eyebrow:"برچسب انگلیسی هیرو",hero_subtitle:"متن اصلی هیرو",hero_cta_label:"عنوان دکمه هیرو",
 hero_image:"تصویر هیرو دسکتاپ",hero_mobile_image:"تصویر هیرو موبایل",
 daily_eyebrow:"برچسب تخفیف امروز",daily_title:"تیتر تخفیف امروز",daily_text:"توضیح تخفیف امروز",
 daily_image:"تصویر تخفیف امروز",daily_cta_label:"دکمه تخفیف امروز",
 best_eyebrow:"برچسب منتخب دیجی‌کالا",best_title:"تیتر منتخب دیجی‌کالا",
 best_text:"توضیح منتخب دیجی‌کالا",best_image:"تصویر منتخب دیجی‌کالا",best_cta_label:"دکمه منتخب دیجی‌کالا",
 collections_title:"تیتر مجموعه‌ها",collections_text:"متن معرفی مجموعه‌ها",
 magazine_title:"تیتر مجله",magazine_text:"متن معرفی مجله",
 about_heading:"عنوان صفحه درباره ما",about_intro:"توضیح بالای درباره ما",
 about_section_heading:"تیتر بخش داستان برند",about_section_text:"متن داستان برند",
 contact_heading:"عنوان صفحه تماس",contact_intro:"توضیح بالای تماس",
 contact_section_heading:"تیتر بخش راه‌های ارتباط",contact_section_text:"متن راه‌های ارتباط",
 footer_about_text:"معرفی کوتاه برند در فوتر",footer_location_text:"توضیح موقعیت دارما",
 shop_page_intro:"توضیح صفحه فروشگاه",magazine_page_intro:"توضیح بالای مجله",
 slug:"شناسه آدرس",name:"عنوان",eyebrow:"برچسب انگلیسی",description:"توضیحات",
 image:"تصویر",visible:"نمایش در سایت",sort_index:"ترتیب نمایش",
 title:"عنوان",summary:"خلاصه",body:"متن مقاله",status:"وضعیت انتشار",
 material:"نوع پارچه",category_slug:"شناسه مجموعه",verified:"اطلاعات تأیید شده",
 seo_title:"عنوان سئو",seo_description:"توضیح متا",
 product_slug:"شناسه محصول",sku:"شناسه SKU",size:"سایز",color:"رنگ",
 pack_count:"تعداد در بسته",price_irr:"قیمت به ریال (برای سیستم)",price_toman:"قیمت فروش به تومان",stock_qty:"موجودی عددی",
 price_verified:"قیمت تأیید شده",stock_verified:"موجودی تأیید شده",enabled:"فعال",
 order_number:"شماره سفارش",customer_name:"نام مشتری",customer_phone:"شماره تماس مشتری",
 shipping_address:"آدرس ارسال",total_irr:"مبلغ کل به ریال",payment_status:"وضعیت پرداخت",
 fulfillment_status:"وضعیت ارسال",source:"منبع سفارش",notes:"یادداشت",created_at:"تاریخ ثبت",
 product_title:"عنوان کالا",quantity:"تعداد",unit_price_irr:"قیمت واحد ریالی"
};
const translation=(name)=>persianLabels[name]?
  [{language:"en-US",translation:persianLabels[name]},{language:"fa-IR",translation:persianLabels[name]}]:[];

const choices={
 status:[["پیش‌نویس","draft"],["منتشرشده","published"]],
 size:[["M","M"],["L","L"],["XL","XL"],["XXL","XXL"],["XXXL","XXXL"]],
 payment_status:[["در انتظار پرداخت","pending"],["پرداخت شده","paid"],["ناموفق","failed"],["بازپرداخت شده","refunded"]],
 fulfillment_status:[["سفارش جدید","new"],["در حال پردازش","processing"],["ارسال شده","shipped"],["تحویل شده","delivered"],["لغو شده","cancelled"]],
 source:[["سایت","website"],["ثبت دستی","manual"],["سایر","other"]]
};
const field=(name,type,ui="input",note)=>({
  field:name,type,
  meta:{
    interface:choices[name]?"select-dropdown":ui,
    ...(choices[name]?{options:{choices:choices[name].map(([text,value])=>({text,value}))}}:{}),
    translations:translation(name),
    ...(note ? {note} : {})
  }
});
const text=(name,note)=>field(name,"text","input-multiline",note);
const str=(name,note)=>field(name,"string","input",note);
const file=(name,note)=>({field:name,type:"uuid",meta:{interface:"file-image",special:["file"],translations:translation(name), ...(note?{note}:{})}});
const num=(name,note)=>field(name,"integer","input",note);
const yes=(name,note)=>field(name,"boolean","boolean",note);

const collections=[
  {name:"darma_content",label:"مدیریت صفحه اصلی",icon:"web",singleton:true,note:"Homepage wording and campaign photos. Layout and palette remain controlled by GitHub.",fields:[
    str("hero_eyebrow"),text("hero_subtitle"),str("hero_cta_label"),
    file("hero_image","Main desktop homepage image"),file("hero_mobile_image","Optional separate mobile image"),
    str("daily_eyebrow"),str("daily_title"),text("daily_text"),file("daily_image"),str("daily_cta_label"),
    str("best_eyebrow"),str("best_title"),text("best_text"),file("best_image"),str("best_cta_label"),
    str("collections_title"),text("collections_text"),str("magazine_title"),text("magazine_text"),
    str("about_heading"),text("about_intro"),str("about_section_heading"),text("about_section_text"),
    str("contact_heading"),text("contact_intro"),str("contact_section_heading"),text("contact_section_text"),
    text("footer_about_text"),text("footer_location_text"),
    text("shop_page_intro"),text("magazine_page_intro")
  ]},
  {name:"darma_categories",label:"مجموعه‌های دارما",icon:"category",note:"Four fixed editorial category positions; text and photos can be changed.",fields:[
    str("slug","Use the existing category slug; editing slugs changes URLs."),
    str("name"),str("eyebrow"),text("description"),file("image"),
    num("sort_index"),yes("visible")
  ]},
  {name:"darma_articles",label:"مجله دارما",icon:"article",note:"Magazine teasers; only published articles are used on the homepage.",fields:[
    str("slug"),str("title"),text("summary"),text("body"),file("image"),
    str("status","draft | published"),num("sort_index")
  ]},
  {name:"darma_products",label:"محصولات دارما",icon:"checkroom",note:"Product drafts and approved catalog; publishing requires verified details.",fields:[
    str("slug"),str("title"),text("description"),str("material"),str("category_slug"),
    file("image"),str("status","draft | published"),yes("verified"),
    str("seo_title"),text("seo_description")
  ]},
  {name:"darma_variants",label:"تنوع و قیمت‌ها",icon:"sell",note:"Real SKU variants; IRR prices (rials) and verified stock, NOT Toman.",fields:[
    str("product_slug"),str("sku"),str("size"),str("color"),num("pack_count"),
    num("price_toman","قیمت را به تومان وارد کن. سایت خودش آن را به ریال تبدیل می‌کند."),num("price_irr","اختیاری: برای اتصال API. اگر قیمت تومان وارد شده، همان مرجع است."),num("stock_qty"),yes("price_verified"),yes("stock_verified"),yes("enabled")
  ]},
  {name:"darma_orders",label:"سفارش‌ها",icon:"shopping_cart",note:"Order tracking data model. Automatic checkout and payment callbacks are NOT connected yet.",fields:[
    str("order_number"),str("customer_name"),str("customer_phone"),
    text("shipping_address"),num("total_irr"),str("payment_status"),
    str("fulfillment_status"),str("source"),text("notes"),str("created_at")
  ]},
  {name:"darma_order_lines",label:"اقلام سفارش",icon:"receipt_long",note:"Line items for future order management; no test orders are inserted.",fields:[
    str("order_number"),str("sku"),str("product_title"),num("quantity"),num("unit_price_irr")
  ]}
];

// Directus intentionally returns 403 (not 404) for a non-existent individual collection.
// Enumerate the admin-visible collection inventory instead of probing absent names.
const knownCollections=await api("GET","/collections");
if(!Array.isArray(knownCollections))throw new Error("Directus admin collection inventory unavailable");
const existingCollections=new Set(knownCollections.map(c=>c.collection));
for (const c of collections) {
  if (existingCollections.has(c.name)) {
    console.log("KEEP collection "+c.name+" (no destructive migration)");
    // Only additive migrations from reviewed GitHub code are allowed.
    // Existing CMS content and field data are never overwritten.
    const actual=await api("GET", "/fields/"+encodeURIComponent(c.name));
    const existingFields=new Map(actual.map(field=>[field.field,field]));
    for(const desired of c.fields){
      const previous=existingFields.get(desired.field);
      if(!previous){
        await api("POST","/fields/"+encodeURIComponent(c.name),desired);
        console.log("ADDED FIELD "+c.name+"."+desired.field);
        continue;
      }
      if(previous.type!==desired.type){
        throw new Error("CMS schema type mismatch; manual reviewed migration required: "+
          c.name+"."+desired.field+" existing="+previous.type+" desired="+desired.type);
      }
    }
    continue;
  }
  await api("POST","/collections",{
    collection:c.name,
    schema:{name:c.name},
    meta:{icon:c.icon,note:c.note,singleton:!!c.singleton,translations:[{language:"en-US",translation:c.label},{language:"fa-IR",translation:c.label}]},
    fields:c.fields
  });
  console.log("CREATED collection "+c.name);
}


// A true Directus Image/File input requires the registered many-to-one file
// relationship, not just a UUID column; create it additively if absent.
const existingRelations=await api("GET","/relations");
if(!Array.isArray(existingRelations))throw new Error("Could not inspect Directus file relations");
const relationKeys=new Set(existingRelations.map(r=>r.collection+"."+r.field));
for(const c of collections){
  for(const f of c.fields.filter(f=>f.meta?.special?.includes("file"))){
    const key=c.name+"."+f.field;
    if(relationKeys.has(key))continue;
    await api("POST","/relations",{
      collection:c.name,field:f.field,related_collection:"directus_files",
      meta:{one_deselect_action:"nullify"},
      schema:{on_delete:"SET NULL"}
    });
    console.log("FILE IMAGE RELATION "+key);
  }
}

// Preserve the editor's changes on each subsequent deploy.
const initial = await api("GET","/items/darma_content?limit=1");
const rows=Array.isArray(initial)?initial:(initial?[initial]:[]);
// A Directus singleton with zero rows returns a default object containing id:null.
if(!rows.some(row=>row && row.id != null)) {
  // First install only: studio identity aligned with DARMA's existing espresso palette.
  // Never overwrite project settings once the owner has begun editing.
  await api("PATCH","/settings",{
    project_name:"DARMA STUDIO",
    project_descriptor:"پنل مدیریت محتوای دارما",
    project_color:"#352724",
    default_language:"fa-IR",
    default_appearance:"dark"
  });
  await api("PATCH","/items/darma_content",{
    hero_eyebrow:"PREMIUM UNDERWEAR",
    hero_subtitle:"لباس زیر زنانه دارما؛ سادگی، راحتی و طراحی مدرن.",
    hero_cta_label:"مشاهده مجموعه",
    daily_eyebrow:"DAILY DEAL",
    daily_title:"تخفیف ویژه امروز",
    daily_text:"کمپین روزانه دارما پس از اتصال قیمت و موجودی فعال می‌شود.",
    daily_cta_label:"مشاهده مجموعه",
    best_eyebrow:"THE DARMA EDIT",
    best_title:"منتخب دارما در دیجی‌کالا",
    best_text:"بسته‌های دارما و جزئیات انتخاب مدل و تعداد در بسته را مشاهده کنید.",
    best_cta_label:"مشاهده بسته‌ها",
    collections_title:"مجموعه محصولات دارما",
    collections_text:"انتخابی ساده‌تر برای سلیقه و نیاز روزمره",
    magazine_title:"مجله دارما",
    magazine_text:"راهنماها، انتخاب آگاهانه و شناخت پارچه",
    about_heading:"درباره دارما",
    about_intro:"دارما؛ از جزئیات پارچه تا انتخاب محصول.",
    about_section_heading:"هر انتخاب، یک تجربه",
    about_section_text:"در دارما تلاش می‌کنیم معرفی محصول، انتخاب رنگ و سایز و شناخت بسته‌های چندعددی روشن و ساده باشد. در نسخه نهایی این صفحه، داستان تأییدشده برند، تصاویر واقعی فرایند تولید و اطلاعات ارتباطی اضافه می‌شود.",
    contact_heading:"ارتباط با دارما",
    contact_intro:"اطلاعات رسمی تماس و نشانی بعد از تأیید نهایی در این صفحه قرار می‌گیرد.",
    contact_section_heading:"همراه دارما باشید",
    contact_section_text:"راه‌های ارتباطی معتبر، شرایط پاسخ‌گویی و آدرس در مرحله آماده‌سازی هستند. از ثبت شماره، ایمیل یا نشانی ساختگی خودداری شده است.",
    footer_about_text:"دارما، مجموعه‌ای از لباس زیر زنانه با تمرکز بر تجربه خرید روشن و معرفی دقیق مدل‌ها، رنگ‌ها و سایزها.",
    footer_location_text:"نقشه پس از تأیید نشانی رسمی اضافه می‌شود.",
    shop_page_intro:"مدل‌های لباس زیر زنانه دارما را در دسته‌بندی‌های مختلف ببینید. انتخاب محصول، سایز، رنگ و تعداد در بسته پس از اتصال کاتالوگ اصلی فعال خواهد شد.",
    magazine_page_intro:"مطالب مفید برای انتخاب آگاهانه؛ نوشته‌شده بر اساس اطلاعات واقعی محصول و تجربه تولید."
  });
  console.log("SEEDED homepage text (approved default copy, no fictional price/image)");
} else console.log("KEEP homepage copy/imagery (already set by editor)");

const categories=[
  ["lace","مدل‌های توری","LACE EDIT","مدل‌های توری دارما"],
  ["everyday","مدل‌های ساده","EVERYDAY","مدل‌های ساده دارما"],
  ["packs","پک‌های اقتصادی","THE EDIT","پک‌های چندعددی دارما"],
  ["comfort","مدل‌های راحتی","COMFORT","مدل‌های راحتی دارما"]
];
const existing=await api("GET","/items/darma_categories?fields=slug&limit=100");
const have=new Set((Array.isArray(existing)?existing:[]).map(x=>x.slug));
for(let i=0;i<categories.length;i++){
  const [slug,name,eyebrow,description]=categories[i];
  if(have.has(slug))continue;
  await api("POST","/items/darma_categories",{
    slug,name,eyebrow,description,sort_index:i+1,visible:true
  });
}
console.log("DARMA_CMS_SCHEMA_READY; no products, variants or orders were fabricated.");
