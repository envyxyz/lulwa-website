import { chromium } from 'playwright';
// Same pages and viewports for before and after. Usage: node scripts/shots.mjs https://lulwa.com.sa docs/after/
const [base = 'https://lulwa.com.sa', out = 'docs/after/'] = process.argv.slice(2);
const pages = { home:'/', services:'/services', 'svc-ac':'/services/ac-repair', 'svc-washer':'/services/washing-machine-repair', 'area-dammam':'/areas/appliance-repair-in-dammam', areas:'/areas', 'brand-lg':'/brands/lg-appliance-repair', brands:'/brands', about:'/about', contact:'/contact', blog:'/blog', 'blog-ac':'/blog/ac-repair-in-dammam', privacy:'/privacy-policy' };
const b = await chromium.launch({ channel:'msedge' });
const log = [];
for (const [vn,w,h,mob] of [['1440',1440,900,false],['390',390,844,true]]) {
  const c = await b.newContext({ viewport:{width:w,height:h}, isMobile:mob, hasTouch:mob, deviceScaleFactor:1, locale:'ar-SA' });
  for (const [n,p] of Object.entries(pages)) {
    const pg = await c.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(e.message)); pg.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,160))});
    await pg.goto(base+p,{waitUntil:'load',timeout:60000}); await pg.waitForTimeout(1500);
    for(let y=0,H=await pg.evaluate(()=>document.body.scrollHeight);y<H;y+=700){await pg.evaluate(v=>scrollTo(0,v),y);await pg.waitForTimeout(60)}
    await pg.evaluate(()=>scrollTo(0,0)); await pg.waitForTimeout(400);
    await pg.screenshot({path:`${out}${n}-ar-${vn}-fold.png`}); await pg.screenshot({path:`${out}${n}-ar-${vn}-full.png`,fullPage:true});
    const ov=await pg.evaluate(()=>[document.documentElement.scrollWidth,innerWidth,document.body.scrollHeight]);
    if(n==='home'||n==='svc-ac'){ const t=await pg.$('#langToggle'); if(t&&await t.isVisible()){await t.click();await pg.waitForTimeout(1200);await pg.screenshot({path:`${out}${n}-en-${vn}-fold.png`});await pg.screenshot({path:`${out}${n}-en-${vn}-full.png`,fullPage:true});log.push(n+' en url '+pg.url()+' lang '+await pg.evaluate(()=>document.documentElement.lang+' '+document.title));await t.click().catch(()=>{});} }
    if(mob&&n==='home'){ await pg.goto(base+'/',{waitUntil:'load'});await pg.waitForTimeout(800);const m=await pg.$('.mobile-menu-btn');if(m){await m.click();await pg.waitForTimeout(700);await pg.screenshot({path:`${out}home-ar-390-menu.png`});}}
    log.push(`${vn} ${n} scrollW/innerW/H ${ov} errs ${errs.length} ${errs.slice(0,2).join(' | ')}`);
    await pg.close();
  }
  await c.close();
}
const pg=await b.newPage({viewport:{width:1440,height:900}});await pg.goto('https://automaticwashingmachine.com/ar/',{waitUntil:'load',timeout:60000});await pg.waitForTimeout(1500);await pg.screenshot({path:out+'second-site-ar-1440-fold.png'});
await b.close(); console.log(log.join('\n'));
