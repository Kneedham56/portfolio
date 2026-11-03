import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [n, vp] of [['desk',{width:1280,height:900}],['phone',{width:390,height:844}]]) {
  const p = await (await b.newContext({ viewport: vp })).newPage();
  await p.goto(pathToFileURL(path.join(root,'site','index.html')).href);
  await p.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager')); await p.waitForTimeout(1200);
  console.log(n,'horizontal overflow px:',await p.evaluate(()=>document.documentElement.scrollWidth - innerWidth));
  await p.screenshot({ path: path.join(root,'shots',`_site-${n}.png`), fullPage: true });
}
await b.close();
