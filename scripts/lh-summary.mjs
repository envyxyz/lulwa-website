import { readdirSync, readFileSync } from 'node:fs';
const dir = process.argv[2];
const rows = readdirSync(dir).filter(f=>/^lhr-.*\.json$/.test(f)).map(f=>JSON.parse(readFileSync(dir+'/'+f,'utf8')));
let bad=0;
for (const r of rows.sort((a,b)=>a.requestedUrl.localeCompare(b.requestedUrl))) {
  const c=Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k.slice(0,4),Math.round(v.score*100)]));
  const a=r.audits, m=[a['largest-contentful-paint'].numericValue|0, a['total-blocking-time'].numericValue|0, +a['cumulative-layout-shift'].numericValue.toFixed(3)];
  const kb=Math.round(a['total-byte-weight'].numericValue/1024);
  const fail = Object.values(c).some(v=>v<95)||m[0]>2000||m[1]>100||m[2]>0.05;
  if(fail)bad++;
  console.log((fail?'FAIL ':'ok   ')+new URL(r.requestedUrl).pathname.padEnd(55),JSON.stringify(c),'LCP',m[0],'TBT',m[1],'CLS',m[2],kb+'KB');
}
console.log(rows.length,'routes,',bad,'failing');
