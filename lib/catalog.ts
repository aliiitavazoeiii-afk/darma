export type Collection = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  ready: boolean;
};

export const collections: Collection[] = [
  {
    slug: "lace",
    name: "مدل‌های توری",
    eyebrow: "LACE EDIT",
    description: "مدل‌های توری دارما؛ اطلاعات نهایی پس از تأیید کاتالوگ و تصاویر واقعی منتشر می‌شود.",
    ready: false
  },
  {
    slug: "everyday",
    name: "مدل‌های ساده",
    eyebrow: "EVERYDAY",
    description: "مدل‌های ساده دارما؛ مشخصات جنس، رنگ و سایز پس از بررسی موجودی ثبت می‌شود.",
    ready: false
  },
  {
    slug: "packs",
    name: "پک‌های اقتصادی",
    eyebrow: "THE EDIT",
    description: "بسته‌های چندعددی دارما؛ تعداد، قیمت و موجودی به منبع واقعی کالا متصل خواهد شد.",
    ready: false
  },
  {
    slug: "comfort",
    name: "مدل‌های راحتی",
    eyebrow: "COMFORT",
    description: "مجموعه راحتی دارما؛ دسته‌بندی نهایی به کاتالوگ تأییدشده وابسته است.",
    ready: false
  }
];

export type ProductVariant = {
  sku: string;
  size: string;
  color: string;
  packCount: number;
  priceIrr: number | null;
  inStock: boolean;
};

export type Product = {
  slug: string;
  title: string;
  description: string;
  material: string | null;
  image: string | null;
  published: boolean;
  variants: ProductVariant[];
};

// No fabricated SKU, stock, prices, reviews or product imagery.
// Real catalog records are added only after approved source-of-truth integration.
export const products: Product[] = [];

export function publishedProducts() {
  return products.filter((product) => product.published);
}

export function publishedProduct(slug: string) {
  return publishedProducts().find((product) => product.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
