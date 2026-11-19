#!/usr/bin/env node
/**
 * Chromium layout/color smoke for the real Next.js production build.
 * Uses dummy/no CMS connection (preserves editorial defaults and real hero).
 * Non-mutating; captures desktop/tablet/mobile screenshots as CI artifacts.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import fs from "node:fs";
import assert from "node:assert/strict";
const port="31427",origin="http://127.0.0.1:"+port;
const server=spawn(process.execPath,[
  "node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port",port
],{env:{...process.env,NEXT_PUBLIC_SITE_LIVE:"false",DARMA_CMS_URL:"",DARMA_CMS_TOKEN:""},stdio:["ignore","pipe","pipe"]});
let output="";
server.stdout.on("data",d=>output+=d);
server.stderr.on("data",d=>output+=d);
const viewports=[
  {name:"mobile",width:375,height:812},
  {name:"tablet",width:768,height:1024},
  {name:"desktop",width:1440,height:900}
];
const pages=["/","/shop","/shop/packs","/magazine","/about","/contact"];
let browser;
try{
  let ready=false;
  for(let i=0;i<80;i++){
    try{
      const response=await fetch(origin+"/",{signal:AbortSignal.timeout(1600)});
      if(response.status===200){ready=true;break;}
    }catch{}
    await delay(450);
  }
  assert.ok(ready,"Production Next.js server did not start: "+output.slice(-1500));
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  fs.mkdirSync("test-artifacts/mocha-elegance",{recursive:true});
  for(const viewport of viewports){
    const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},
      deviceScaleFactor:1,locale:"fa-IR",reducedMotion:"reduce"});
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    for(const route of pages){
      const r=await page.goto(origin+route,{waitUntil:"domcontentloaded",timeout:30000});
      assert.equal(r?.status(),200,viewport.name+" "+route+" must HTTP 200");
      assert.equal(await page.locator("h1").count(),1,viewport.name+" "+route+" single H1");
      const measure=await page.evaluate(()=>{
        const root=document.documentElement,style=getComputedStyle(root);
        const rgb=(str)=>str.replace(/\s+/g,"");
        const footer=document.querySelector(".site-footer");
        return {
          documentWidth:root.scrollWidth,viewportWidth:root.clientWidth,
          palette:{
            espresso:style.getPropertyValue("--brand-espresso").trim(),
            mocha:style.getPropertyValue("--brand-mocha").trim(),
            sage:style.getPropertyValue("--brand-sage").trim(),
            cream:style.getPropertyValue("--brand-cream").trim()
          },
          footerBg:footer?rgb(getComputedStyle(footer).backgroundColor):""
        };
      });
      assert.ok(measure.documentWidth<=measure.viewportWidth+2,
        viewport.name+" "+route+" horizontal body overflow "+
        measure.documentWidth+">"+measure.viewportWidth);
      assert.equal(measure.palette.espresso,"#49362F");
      assert.equal(measure.palette.mocha,"#C7AD96");
      assert.equal(measure.palette.sage,"#788779");
      assert.equal(measure.palette.cream,"#F8F5F0");
      assert.equal(measure.footerBg,"rgb(73,54,47)",viewport.name+" "+route+" footer must be espresso");
      if(route==="/"){
        const hero=page.locator(".hero--product .hero__art img");
        assert.equal(await hero.count(),1,"Approved real hero image must still render");
        const img=await hero.evaluate(node=>({src:node.getAttribute("src"),valid:node.complete&&node.naturalWidth>0}));
        assert.equal(img.src,"/media/hero-desktop.webp","Owner photo URL may not be changed");
        assert.ok(img.valid,"Hero photo must decode in "+viewport.name);
        const campaign=page.locator(".daily__message .button--rose");
        const buttonStyle=await campaign.evaluate(node=>({
          bg:getComputedStyle(node).backgroundColor,
          color:getComputedStyle(node).color
        }));
        assert.equal(buttonStyle.bg,"rgb(73, 54, 47)","Primary CTA must be espresso");
        assert.equal(buttonStyle.color,"rgb(255, 252, 248)","Primary CTA must use warm white text");
      }
      if(route==="/"||route==="/shop"||route==="/shop/packs"){
        await page.evaluate(()=>document.fonts.ready);
        const name=route==="/"? "home" : route.slice(1).replace(/\//g,"-");
        await page.screenshot({
          path:"test-artifacts/mocha-elegance/"+viewport.name+"-"+name+".png",
          fullPage:true,animations:"disabled",timeout:25000
        });
      }
    }
    assert.deepEqual(errors,[],viewport.name+" unexpected JS runtime errors");
    console.log("DARMA VIEWPORT PASS "+viewport.name+" "+viewport.width+"px / "+pages.length+" routes");
    await page.close();
  }
  console.log("DARMA MOCHA RESPONSIVE BROWSER / SCREENSHOT SMOKE: PASS");
}catch(e){
  console.error("DARMA MOCHA RESPONSIVE TEST FAILED:",e);
  process.exitCode=1;
}finally{
  if(browser)await browser.close();
  server.kill("SIGTERM");
  await delay(300);
}
