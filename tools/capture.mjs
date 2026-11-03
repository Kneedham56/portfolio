import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const root = path.resolve(import.meta.dirname, '..');
const url = (f, h) => pathToFileURL(path.join(root, 'mocks', f)).href + '#' + h;
const exe = '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath: exe });

async function shot(file, hash, out, vp, scale) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: scale });
  const p = await ctx.newPage();
  await p.goto(url(file, hash));
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(root, 'shots', out) });
  await ctx.close();
}
async function clip(file, hash, out, vp, fn, ms) {
  const dir = path.join(root, 'shots', '_vid-' + out);
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: vp, recordVideo: { dir, size: vp } });
  const p = await ctx.newPage();
  await p.goto(url(file, hash));
  await p.waitForTimeout(800);
  await p.evaluate(fn);
  await p.waitForTimeout(ms);
  await ctx.close();
  const webm = fs.readdirSync(dir).find(f => f.endsWith('.webm'));
  fs.renameSync(path.join(dir, webm), path.join(root, 'shots', out + '.webm'));
  fs.rmSync(dir, { recursive: true });
}
const phone = { width: 390, height: 844 };
const desk = { width: 1280, height: 800 };
for (const [h, n] of [['home','home'],['outgoing','outgoing']]) await shot('sale-away.html', h, `sale-away-${n}.png`, phone, 2);
await shot('crew-pay.html','payrun','crew-pay-payrun.png',desk,2);
await shot('crew-pay.html','checks','crew-pay-checks.png',desk,2);
await shot('crew-pay.html','onboarding','crew-pay-onboarding.png',desk,2);
// listing screen after generate
{
  const ctx = await browser.newContext({ viewport: phone, deviceScaleFactor: 2 });
  const p = await ctx.newPage(); await p.goto(url('sale-away.html','item'));
  await p.evaluate(() => window.runGenerate()); await p.waitForTimeout(4000);
  await p.screenshot({ path: path.join(root,'shots','sale-away-listing.png') }); await ctx.close();
}
await clip('sale-away.html','item','sale-away-listing-clip',phone,() => window.runGenerate(),4200);
await clip('crew-pay.html','payrun','crew-pay-payrun-clip',desk,() => window.runPayRun(),6000);
await browser.close();
console.log(fs.readdirSync(path.join(root,'shots')));
