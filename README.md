# Portfolio

Static portfolio page for Kyle Needham's product work. No build step.

- `site/`: the deployable page (`index.html` + `assets/`)
- `mocks/`: fake-data HTML screens that the screenshots and clips are captured from
- `tools/capture.mjs`, `capture2.mjs`, `capture3.mjs`: Playwright scripts that regenerate `shots/`
- `shots/`: full-resolution captures (the optimized copies live in `site/assets/`)

All screens use made-up names and numbers. Nothing here comes from a real database.

## Deploy (Vercel)

1. Import this repo as a Vercel project.
2. Framework preset: **Other**. Build command: none. **Output directory: `site`**.
3. Rename the project/domain as you like.

## Regenerate screenshots

Needs Playwright with Chromium. Edit a file in `mocks/`, then run `node tools/capture.mjs`,
and re-run the webp/mp4 conversion into `site/assets/`.
