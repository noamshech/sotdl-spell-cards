# Hearth & Hex (SotDL Spells)

Cozy Shadow of the Demon Lord spell grimoire — browse all cards, track known traditions/spells, and manage castings.

## No accounts (by design)

Everything saves in your browser with **localStorage**. Free, private, no login.

- Export / import JSON from the Character page to back up or move between devices
- Data stays on that browser + site origin only

## Run locally

```bash
cd web
npm install
npm run dev
```

Open http://127.0.0.1:5173/

```bash
npm run build
npm run preview
```

## Deploy free — Cloudflare Pages

### Option A: Direct upload (fastest)

From the `web` folder, after a build:

```bash
cd web
npm run build
npx wrangler pages deploy dist --project-name hearth-hex
```

Log in when the browser opens. Cloudflare prints a `*.pages.dev` URL when done.

### Option B: Connect GitHub (auto-deploy on every push)

1. Create a GitHub repo and push this project
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Pick the repo
4. Build settings:
   - **Framework preset:** Vite
   - **Root directory:** `web`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Save and Deploy**

You get a permanent `https://hearth-hex.pages.dev` (or similar) link. Later pushes to `main` redeploy automatically.

## Features

- Library: multi-select cascading filters + full-text search
- Card images from the extracted PNGs
- Discover traditions via rank 0 spells; learn higher ranks per SotDL rules
- Castings per spell from the Power table; Rest restores all
- Multiple characters
