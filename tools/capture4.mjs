import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport: { width: 1280, height: 620 }, deviceScaleFactor: 2 })).newPage();
await p.goto(pathToFileURL(path.join(root, 'mocks', 'powerwheel-prep.html')).href);
await p.screenshot({ path: path.join(root, 'shots', 'powerwheel-prep.png') });
await b.close();
