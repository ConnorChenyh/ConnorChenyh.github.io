import { readFile, mkdir } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';
const html = await readFile('public/resume/index.html', 'utf8');
let article = html.match(/<article id="article-container"[^>]*>([\s\S]*?)<\/article>/)?.[1];
if (!article) throw new Error('Resume article is missing');
article = article.replace(/(<h2 id="Technical-Skills"[\s\S]*?)(?=<h2 id="Work-Experience")/, '<section class="skills">$1</section>');
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Connor Chen — Resume</title><style>
    body{font:9.5pt/1.3 Arial,sans-serif;color:#182235} h1{font-size:25pt;margin:0 0 6pt}h2{font-size:14pt;border-bottom:1px solid #ccd5df;padding-bottom:4pt;margin:12pt 0 6pt}h3{font-size:11pt;margin:8pt 0 4pt}p{margin:5pt 0}ul{padding-left:18pt;margin:5pt 0}li{margin:2pt 0}h2,h3{break-after:avoid}li{break-inside:avoid}hr{display:none}a{color:#245da4;text-decoration:none}.resume-actions{display:none}.skills{columns:2;column-gap:24pt}.skills h2{column-span:all}.skills ul{break-inside:avoid}
  </style></head><body>${article}</body></html>`);
  await mkdir('public/downloads', { recursive: true });
  await page.pdf({ path: 'public/downloads/Connor-Chen-Resume.pdf', format: 'A4', margin: { top: '14mm', bottom: '16mm', left: '16mm', right: '16mm' }, printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font:8px Arial;width:100%;text-align:center;color:#777">Connor Chen · Resume · <span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
  console.log('Generated PDF from the same resume article (no separate content copy).');
} finally { await browser.close(); }
