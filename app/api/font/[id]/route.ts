import { getLicensedHeroFontAsset, isImageId } from "@/lib/cms";

// Private WOFF2 uploads are exposed ONLY if selected as the homepage hero font.
// Editors must possess a valid website/webfont license for commercial typefaces.
export const dynamic = "force-dynamic";
type Props={params:Promise<{id:string}>};
export async function GET(_request:Request,{params}:Props){
  const {id}=await params;
  if(!isImageId(id))return new Response("Not found",{status:404});
  const asset=await getLicensedHeroFontAsset(id);
  if(!asset)return new Response("Not found",{status:404});
  const maxBytes=4*1024*1024;
  const indicated=Number(asset.headers.get("content-length")||"0");
  if(indicated>maxBytes)return new Response("Font too large",{status:413});
  try{
    const buffer=await asset.arrayBuffer();
    const bytes=new Uint8Array(buffer);
    if(bytes.length<5 || bytes.length>maxBytes ||
       bytes[0]!==119 || bytes[1]!==79 || bytes[2]!==70 || bytes[3]!==50){
      return new Response("Invalid WOFF2 file",{status:415});
    }
    return new Response(buffer,{
      status:200,
      headers:{
        "Content-Type":"font/woff2",
        "Cache-Control":"public, max-age=120",
        "X-Content-Type-Options":"nosniff",
        "Content-Security-Policy":"default-src 'none'"
      }
    });
  }catch{return new Response("Font unavailable",{status:502});}
}
