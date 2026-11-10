# Development and maintenance

## Structure

- `source/`: Markdown content, optimized images, site CSS and JavaScript.
- `layout/home.ejs`: small homepage override using Async's supported layout hook.
- `scripts/site.js`: Hexo hooks for diagrams, local Mermaid runtime, canonical URLs,
  image loading priority, zoom accessibility, and the old resume URL redirect.
- `tools/`: PDF generation, static output checks, and browser verification.
- `.github/workflows/pages.yml`: Node 24, lockfile installation, checks and Pages deployment.

Keep detailed maintenance knowledge here rather than expanding the README.

## Images

Pages use WebP assets. Original JPEG/PNG files are retained as editable source and
for compatibility with previously shared image URLs. Do not link originals from
new pages. The homepage banner is limited to 300 KB by the output check.

Example with `cwebp` (install through your package manager):

```sh
cwebp -q 78 -resize 1600 0 source/images/banner.JPG -o source/images/banner.webp
```

Use 256px for the avatar and 16/32px PNGs for favicons. Avoid enlarging images that
are already smaller than their intended display size. Main banners are eager/high
priority; post cards and inline article images are lazy loaded.

## Content and metadata

Set a short, page-specific `description` in front matter. Use factual project
summaries before long implementation details. Keep the original publication dates;
use `updated` only when intentionally recording a content update. The resume is a
historical career snapshot through UNAL, not a claim of current employment there.

The sitemap plugin generates `sitemap.xml`; `robots.txt` references it. The theme
provides Open Graph/Twitter metadata and the site hook adds a canonical URL.
The original `/2025/12/22/251222_resume/` URL redirects to `/resume/` and is noindex.
GitHub Pages serves the custom `404.html` for unknown paths.

## Mermaid

Use fenced `mermaid` blocks only. Never add script tags to articles. The Hexo hook
escapes the diagram source before HTML insertion and serves the npm-locked Mermaid
runtime locally, only on pages with diagrams. All 10 current diagrams are covered
by browser checks. After dependency changes, rerun those checks before merging.

## PDF and print

`npm run build` generates `public/downloads/Connor-Chen-Resume.pdf` from the rendered
resume article, with a standalone A4 layout. It does not need a running web server.
The web resume also provides a print button and print stylesheet.

## Checks

`npm run check` checks internal href/src targets across every generated HTML page,
required metadata, old resume redirect, PDF signature, sitemap entry, the approved
UNAL end date, and homepage image budget. It does not test external link availability.

`npm run check:browser` starts and closes an ephemeral local server and browser. It
checks 1440px and 390px layouts, runtime errors, mobile navigation, all Mermaid SVGs,
and the old resume redirect. Screenshots are written to ignored `tmp/qa/` for visual
review, including print mode. A screenshot alone is not an automated layout proof.

For PDF visual QA, render with Poppler and inspect every page:

```sh
pdftoppm -scale-to 1400 -png public/downloads/Connor-Chen-Resume.pdf tmp/qa/resume-pdf
```

The theme still needs `hexo-renderer-less`; Landscape and its Stylus renderer are
unused and removed. Dependabot checks npm and Actions weekly; minor/patch npm
updates are grouped. Review major upgrades individually.
