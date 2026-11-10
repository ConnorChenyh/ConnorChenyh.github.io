import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';
import { startServer } from './preview-server.mjs';
const server = await startServer();
const browser = await launchBrowser();
const errors = [];
await mkdir('tmp/qa', { recursive:true });
try {
  for (const width of [1440,390]) {
    const page = await browser.newPage({ viewport: { width, height:900 } });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const [slug,name,count] of [['','home',0],['resume/','resume',0],['projects/','projects',0],['2025/12/22/251222_otc/','otc',8],['2025/12/22/251222_kyd/','kyd',2]]) {
      await page.goto(`${server.url}/${slug}`, {waitUntil:'networkidle'});
      if (count) await page.waitForFunction(n => document.querySelectorAll('.mermaid[data-processed="true"] svg').length === n, count);
      assert.equal(await page.locator('.mermaid svg .error-icon').count(), 0, 'Mermaid parse error');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name} overflows at ${width}px`);
      await page.waitForFunction(() => getComputedStyle(document.querySelector('#trm-scroll-container')).opacity === '1');
      if (name === 'home' && width === 390) {
        await page.locator('.trm-menu-btn').click();
        await page.getByRole('navigation').getByRole('link',{name:'Resume',exact:true}).click();
        await page.waitForURL('**/resume/');
        await page.goto(server.url, {waitUntil:'networkidle'});
      }
      await page.waitForFunction(() => getComputedStyle(document.querySelector('#trm-scroll-container')).opacity === '1');
      await page.screenshot({path:`tmp/qa/${name}-${width}.png`,fullPage:false, animations:'disabled'});
      if (name === 'resume') {
        const pendingDownload = page.waitForEvent('download');
        await page.getByRole('link', { name: 'Download PDF' }).click();
        const download = await pendingDownload;
        assert.equal(download.suggestedFilename(), 'Connor-Chen-Resume.pdf');
        assert.equal(await download.failure(), null);
      }
      if(name==='resume' && width===1440) {
        await page.emulateMedia({media:'print'});
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#trm-scroll-container')).opacity === '1');
      await page.screenshot({path:'tmp/qa/resume-print.png', fullPage:true, animations:'disabled'});
        await page.emulateMedia({media:'screen'});
      }
    }
    await page.goto(`${server.url}/2025/12/22/251222_resume/`);
    await page.waitForURL('**/resume/');
    await page.close();
  }
  assert.deepEqual(errors, [], 'Browser errors');
  console.log('Desktop/mobile pages, all 10 diagrams, mobile navigation, overflow, print screenshot and legacy redirect verified.');
} finally { await browser.close(); await server.close(); }
