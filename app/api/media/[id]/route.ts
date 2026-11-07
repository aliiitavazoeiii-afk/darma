import { getCmsAsset, isApprovedHomepageImage, isImageId } from "@/lib/cms";

// Authenticated upstream proxy. The CMS uploads and orders are NEVER public assets.
export const dynamic = "force-dynamic";
type Props={params:Promise<{id:string}>};
export async function GET(_request:Request,{params}:Props){
  const {id}=await params;
  if(!isImageId(id) || !(await isApprovedHomepageImage(id))){
    return new Response("Not found",{status:404,headers:{"Cache-Control":"no-store"}});
  }
  const asset=await getCmsAsset(id);
  if(!asset?.body)return new Response("Not found",{status:404,headers:{"Cache-Control":"no-store"}});
  const type=asset.headers.get("content-type")||"";
  if(!/^image\/(jpeg|png|webp|avif|gif)$/.test(type.split(";")[0])){
    return new Response("Unsupported file",{status:415,headers:{"Cache-Control":"no-store"}});
  }
  return new Response(asset.body,{
    status:200,
    headers:{
      "Content-Type":type,
      "Cache-Control":"public, max-age=60, stale-while-revalidate=60",
      "X-Content-Type-Options":"nosniff",
      "Content-Security-Policy":"default-src 'none'; sandbox",
      "Vary":"Accept"
    }
  });
}
