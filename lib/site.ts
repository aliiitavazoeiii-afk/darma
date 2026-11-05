export const SITE_URL = "https://darmawear.ir";
export const SITE_LIVE = process.env.NEXT_PUBLIC_SITE_LIVE === "true";
export const BRAND_NAME = "دارما";
export const BRAND_LATIN = "DARMA";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
