/**
 * Trusted real-product catalog from independent DARMA Studio.
 * No fake products/prices/SKUs; published products and each variant must be
 * explicitly owner-verified. Sale/payment remains disabled in preview mode.
 */
import { privateCmsRead, publicCmsImage } from "@/lib/cms";

export type PublicVariant={
  sku:string;size:string;color:string;packCount:number;
  priceIrr:number;stockQty:number;inStock:boolean;
};
export type PublicProduct={
  slug:string;title:string;description:string;
  material:string|null;categorySlug:string|null;image:string|null;
  seoTitle:string|null;seoDescription:string|null;
  variants:PublicVariant[];
};

const rows=(data:unknown):Record<string,unknown>[]=>Array.isArray(data)
  ? data.filter((r):r is Record<string,unknown>=>!!r&&typeof r==="object"&&!Array.isArray(r))
  : [];
const str=(value:unknown,max=400):string|null=>
  typeof value==="string" && value.trim() ? value.trim().slice(0,max):null;
const slug=(value:unknown)=> {
  const v=str(value,64);
  return v && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) ? v : null;
};
const nint=(value:unknown,min:number,max:number):number|null=>
  typeof value==="number" && Number.isSafeInteger(value) && value>=min && value<=max ? value : null;

export async function getCmsPublishedProducts():Promise<PublicProduct[]>{
  const [rawProducts,rawVariants]=await Promise.all([
    privateCmsRead("/items/darma_products?fields=slug,title,description,material,category_slug,image,status,verified,seo_title,seo_description&filter[status][_eq]=published&filter[verified][_eq]=true&limit=250"),
    privateCmsRead("/items/darma_variants?fields=product_slug,sku,size,color,pack_count,price_toman,price_irr,stock_qty,price_verified,stock_verified,enabled&limit=3000")
  ]);
  const variants=rows(rawVariants).flatMap(v=>{
    if(v.enabled!==true||v.price_verified!==true||v.stock_verified!==true) return [];
    const productSlug=slug(v.product_slug),sku=str(v.sku,96),size=str(v.size,25),color=str(v.color,40);
    const packCount=nint(v.pack_count,1,50);
    // Owner-friendly Toman field is authoritative when present; structured data remains IRR.
    const priceToman=nint(v.price_toman,1,200_000_000);
    const priceIrr=priceToman!==null?priceToman*10:nint(v.price_irr,1,2_000_000_000);
    const stockQty=nint(v.stock_qty,0,1_000_000);
    if(!productSlug||!sku||!size||!color||packCount===null||priceIrr===null||stockQty===null)return [];
    return [{productSlug,sku,size,color,packCount,priceIrr,stockQty,inStock:stockQty>0}];
  });
  const encountered=new Set<string>();
  return rows(rawProducts).flatMap(p=>{
    if(p.status!=="published"||p.verified!==true)return [];
    const id=slug(p.slug),title=str(p.title,160),description=str(p.description,1200);
    if(!id||!title||!description||encountered.has(id))return [];
    encountered.add(id);
    const productVariants=variants
      .filter(v=>v.productSlug===id)
      .map(({productSlug:_productSlug,...rest})=>rest);
    if(!productVariants.length)return [];
    return [{
      slug:id,title,description,material:str(p.material,150),
      categorySlug:slug(p.category_slug),
      image:publicCmsImage(p.image as string)??null,
      seoTitle:str(p.seo_title,150),seoDescription:str(p.seo_description,400),
      variants:productVariants
    }];
  });
}

export async function getCmsPublishedProduct(id:string):Promise<PublicProduct|null>{
  if(!slug(id))return null;
  const list=await getCmsPublishedProducts();
  return list.find(x=>x.slug===id)??null;
}
