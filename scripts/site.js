'use strict';
const fs = require('node:fs');
const { escapeHTML } = require('hexo-util');

// Render fenced diagrams without per-article scripts or a second Mermaid version.
hexo.extend.filter.register('before_post_render', data => {
  data.content = data.content.replace(/^```mermaid\s*\n([\s\S]*?)^```\s*$/gm,
    (_, diagram) => `<pre class="mermaid">${escapeHTML(diagram.trim())}</pre>`);
  return data;
}, 9);

hexo.extend.generator.register('mermaid-runtime', () => ({
  path: 'js/vendor/mermaid.min.js',
  data: () => fs.createReadStream(require.resolve('mermaid/dist/mermaid.min.js'))
}));

hexo.extend.generator.register('resume-redirect', () => ({
  path: '2025/12/22/251222_resume/index.html',
  data: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Resume — Connor Chen</title><meta name="robots" content="noindex"><link rel="canonical" href="https://connorchenyh.github.io/resume/"><meta http-equiv="refresh" content="0;url=/resume/"></head><body><a href="/resume/">View Connor Chen’s resume</a></body></html>'
}));

hexo.extend.filter.register('after_render:html', html => {
  // The theme disables zoom by default; keep the page accessible.
  html = html.replace('maximum-scale=5.0, user-scalable=0', 'maximum-scale=5.0');
  const canonical = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (canonical && !html.includes('rel="canonical"')) html = html.replace('</head>', `<link rel="canonical" href="${canonical.replace(/index\.html$/, '')}"></head>`);
  html = html.replace('</head>', '<link rel="stylesheet" href="/css/portfolio.css"></head>');
  html = html.replace(/<img\b[^>]*>/g, tag => {
    if (tag.includes('trm-banner-cover')) return tag.replace(/ loading="lazy"/g, '').replace('<img', '<img fetchpriority="high" loading="eager"');
    if (tag.includes('alt="cover"')) return tag.replace('<img', '<img loading="lazy" decoding="async"');
    return tag;
  });
  if (html.includes('class="mermaid"')) {
    html = html.replace('</body>', '<script defer src="/js/vendor/mermaid.min.js"></script><script defer src="/js/diagrams.js"></script></body>');
  }
  return html;
});
