#!/usr/bin/env node
// CI-only integration check: native file upload + image field assignment + asset read.
// Never run against production. Uses ephemeral runner's disposable CMS.
const base="http://127.0.0.1:8055";
const token=process.env.ADMIN_TOKEN;
if(!token)throw Error("Missing CI admin token");
const request=async(method,path,body,headers={})=>{
  const res=await fetch(base+path,{
    method,headers:{Authorization:"Bearer "+token,...headers},body,
    signal:AbortSignal.timeout(20000)
  });
  const raw=await res.text();
  if(!res.ok)throw Error(method+" "+path+" "+res.status+" "+raw.slice(0,400));
  return JSON.parse(raw).data;
};
const media=Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==","base64");
const form=new FormData();
form.append("file",new Blob([media],{type:"image/gif"}),"darmazero-smoke.gif");
const uploaded=await request("POST","/files",form);
if(!uploaded?.id||typeof uploaded.id!=="string")throw Error("Directus file picker upload failed");
const initial=await request("GET","/items/darma_content?limit=1",undefined);
const row=Array.isArray(initial)?initial[0]:initial;
if(!row?.id)throw Error("Cannot locate seeded singleton home record after first-run upsert");
await request("PATCH","/items/darma_content",JSON.stringify({hero_image:uploaded.id}),{"Content-Type":"application/json"});
const updated=await request("GET","/items/darma_content?limit=1",undefined);
const current=Array.isArray(updated)?updated[0]:updated;
if(current?.hero_image!==uploaded.id)throw Error("Image selector did not persist the uploaded asset UUID");
const asset=await fetch(base+"/assets/"+uploaded.id,{headers:{Authorization:"Bearer "+token},signal:AbortSignal.timeout(15000)});
if(!asset.ok||(asset.headers.get("content-type")||"").indexOf("image/")!==0)throw Error("Uploaded editorial image asset not readable");
console.log("DARMA_CMS_NATIVE_UPLOAD_AND_FIELD_CHANGE_PASS");
