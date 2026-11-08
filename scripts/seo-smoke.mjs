#!/usr/bin/env node
// Server-rendered smoke tests. Requires successful npm run build.
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";
const port="31379", origin="http://127.0.0.1:"+port;
let logs="";
const server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port",port],{
  env:{...process.env,NEXT_PUBLIC_SITE_LIVE:"false"},stdio:["ignore","pipe","pipe"]
});
server.stdout.on("data",v=>logs+=String(v));
server.stderr.on("data",v=>logs+=String(v));
const assert=(condition,why)=>{if(!condition)throw Error(why)};
async function read(url){const r=await fetch(origin+url,{redirect:"manual"});return {status:r.status,html:await r.text()};}
try{
  let started=false;
  for(let i=0;i<80;i++){
    if(server.exitCode!==null)break;
    try{const r=await fetch(origin+"/",{signal:AbortSignal.timeout(1200)});if(r.status===200){started=true;break;}}catch{}
    await pause(500);
  }
  assert(started,"Next start failed: "+logs.slice(-2500));
  for(const route of ["/","/shop","/shop/packs","/magazine","/about","/contact"]){
    const r=await read(route);
    assert(r.status===200,route+" must respond 200");
    assert(/<html[^>]*lang="fa"[^>]*dir="rtl"/.test(r.html),route+" must render fa RTL");
    assert((r.html.match(/<h1\b/g)||[]).length===1,route+" must have exactly one H1");
    assert(/<title>/.test(r.html)&&/name="description"/.test(r.html),route+" metadata missing");
    const canonical=(r.html.match(/<link\b[^>]*>/g)||[]).find(tag=>/rel="canonical"/.test(tag));
    assert(canonical && /href="https:\/\/darmawear\.ir(?:\/[^"]*)?"/.test(canonical),route+" canonical missing: "+String(canonical));
    assert(/name="robots"[^>]*content="[^"]*noindex/.test(r.html),route+" must be noindex in staging");
  }
  const home=await read("/");
  assert(/data-hero-font="original"/.test(home.html),"Default Persian hero font must retain the current design when no selection exists");
  const unknownFont=await read("/api/font/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
  assert(unknownFont.status===404,"Private unpublished licensed font must never become public");
  assert(/application\/ld\+json/.test(home.html)&&/"Organization"/.test(home.html)&&/"WebSite"/.test(home.html),"Brand entity JSON-LD missing");
  const robots=await read("/robots.txt");
  assert(robots.status===200&&/Disallow:\s*\//.test(robots.html),"Staging robots must disallow /");
  const sitemap=await read("/sitemap.xml");
  assert(sitemap.status===200&&!/https:\/\/darmawear\.ir\/shop/.test(sitemap.html),"Staging sitemap must not leak placeholder pages");
  assert((await read("/product/unverified-product")).status===404,"Unverified product should 404");
  console.log("DARMA SSR SEO SMOKE: PASS");
}catch(e){console.error("DARMA SSR SEO SMOKE FAILED",e);process.exitCode=1;}
finally{server.kill("SIGTERM");await pause(300);}
