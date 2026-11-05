import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export function seoMetadata(options: {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
}): Metadata {
  const { title, description, path, indexable = false } = options;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: {
      index: indexable && process.env.NEXT_PUBLIC_SITE_LIVE === "true",
      follow: indexable && process.env.NEXT_PUBLIC_SITE_LIVE === "true"
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(path),
      locale: "fa_IR",
      siteName: "DARMA"
    }
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
