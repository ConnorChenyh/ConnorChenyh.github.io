import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('public');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const files = await walk(root);
const errors = [];
for (const file of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const base = new URL(path.relative(root, file), 'https://connorchenyh.github.io/');
  for (const [, raw] of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const url = new URL(raw.replaceAll('&amp;', '&'), base);
    if (url.origin !== base.origin || !['http:', 'https:'].includes(url.protocol)) continue;
    let target = path.join(root, decodeURIComponent(url.pathname));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
    } catch { errors.push(`${path.relative(root, file)} → ${raw}`); }
  }
}
assert.deepEqual(errors, [], 'Broken internal links or assets');
for (const name of ['index.html','resume/index.html','projects/index.html','2025/12/22/251222_otc/index.html','2025/12/22/251222_kyd/index.html']) {
  const html = await readFile(path.join(root, name),'utf8');
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:image"/);
  assert.doesNotMatch(html, /user-scalable=0/);
}
const resume = await readFile(path.join(root,'resume/index.html'),'utf8');
assert(resume.replaceAll('&#x2F;', '/').includes('10/2025 – 10 Apr 2026'), 'UNAL end date');
assert.match(resume, /downloads\/Connor-Chen-Resume.pdf/);
const pdf = await readFile(path.join(root,'downloads/Connor-Chen-Resume.pdf'));
assert.equal(pdf.subarray(0,5).toString(), '%PDF-');
assert.match(await readFile(path.join(root,'2025/12/22/251222_resume/index.html'),'utf8'), /0;url=\/resume\//);
assert.match(await readFile(path.join(root,'sitemap.xml'),'utf8'), /https:\/\/connorchenyh.github.io\/resume\//);
assert((await stat(path.join(root,'images/banner.webp'))).size < 300_000);
console.log(`Checked all internal links/assets across ${files.filter(f=>f.endsWith('.html')).length} pages, metadata, redirect, PDF, resume date, sitemap, and banner budget.`);
