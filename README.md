# Connor Chen — Resume & Projects

Personal portfolio built with Hexo 8 and the Async theme, published at
[connorchenyh.github.io](https://connorchenyh.github.io/).

## Local development

Use Node.js 24 LTS (see `.nvmrc`).

```sh
nvm use
npm ci
npx playwright install chromium
npm run build
npm run server
```

Open http://localhost:4000. On macOS, the PDF builder uses installed Google Chrome
when available; otherwise it uses Playwright Chromium. `CHROME_PATH` can select an
installed Chromium executable. Linux CI installs Chromium and its OS dependencies.

## Edit content

- Resume: `source/_posts/251222_resume.md` → `/resume/`
- Project case studies: `source/_posts/251222_otc.md` and `251222_kyd.md`
- Project overview: `source/projects/index.md`
- Site settings: `_config.yml`; theme/navigation: `_config.async.yml`

The current Web3 role uses an approved, anonymized description. Keep the employer,
start date, internal systems, and business-specific details undisclosed unless explicitly
authorized. UNAL employment ended on 10 April 2026.
The PDF is generated from the same rendered resume on every build.

## Validate and publish

```sh
npm run build
npm run check
npm run check:browser
```

Pull requests run build, link/metadata checks, and desktop/mobile browser checks.
Pushing to `main` or manually running the Pages workflow on `main` publishes through
GitHub Actions. Repository Pages settings must use **GitHub Actions** as the source.
Do not commit `public/`, `node_modules/`, or `tmp/`.

See [development notes](docs/development.md) for assets, templates, and verification.
