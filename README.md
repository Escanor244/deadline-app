# Kairos Studio // Countdown Lock Screen & Reverse Planner

> **A precision reverse-engineering deadline planner and retina countdown lock screen generator.**  
> 100% Client-Side with Hybrid MongoDB Cloud Sync. Zero Backend Required. Deployable to Vercel.

---

## ⚡ What Makes ChronoLock Anti-Slop?

1. **Precision Swiss & Monospaced Typography**: Tabular numerical clock alignments, clean hierarchical sans headings, and tactile hairline borders instead of random generic gradients.
2. **6 Distinct Curated Aesthetic Archetypes**:
   - **Obsidian Swiss**: Minimalist Swiss grid on titanium charcoal (`#09090b`).
   - **Cyber Telemetry**: Retro-futuristic phosphor CRT scanlines and telemetry counters.
   - **Twilight Aura**: Velvet purple ambient mesh aura with frosted glassmorphism cards.
   - **Bauhaus Construct**: High-contrast geometric color blocking and stark typography.
   - **Zen Sanctuary**: Earthy moss and stone tones with tranquil focus rings.
   - **Custom Darkroom**: Upload any personal image or Gemini multimodal art, with interactive blur & legibility dimming controls.
3. **Native Retina Resolution Wallpaper Export**:
   - HTML5 Canvas rasterization at true native resolutions:
     - **iPhone 16 Pro**: 1179 × 2556 px
     - **Google Pixel 9**: 1080 × 2400 px
     - **Desktop / Monitor**: 2560 × 1440 px
   - Crystal clear text and zero scaling blur when set as mobile lock screen wallpaper.
4. **100% Client-Side & Vercel Ready**:
   - Zero database or server API route prerequisites.
   - Browser `localStorage` auto-persistence for plans and settings.
   - Pure Web Audio API ambient sound synthesizer (Brown Noise, Pink Noise, Binaural Drone, Clock Ticks).
   - Generates standard RFC 5545 `.ics` iCalendar files directly via Blob download (Apple Calendar, Google Calendar, Outlook) with automated 24-hour and 2-hour alarm triggers.
   - Universal data persistence (MongoDB Atlas, LocalStorage, and 1-Click JSON Backup).

---

## 🚀 Running Locally

```bash
# Install dependencies
pnpm install

# Run local development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel (1-Click)

1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and select the repository.
3. Click **Deploy**! (Requires 0 environment variables to run in local/client mode).

### (Optional) Enable Cloud MongoDB Atlas Persistence

To enable cloud persistence across devices:
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. In your Vercel Project Settings > **Environment Variables**, add:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
   - `MONGODB_DB`: `kairos_studio` (optional, defaults to `kairos_studio`)
3. Redeploy. Kairos will automatically detect the database and switch the storage indicator to `● MongoDB Atlas Connected`!
4. If no `MONGODB_URI` is provided, the app runs in zero-config mode with full LocalStorage persistence, 1-click JSON backup/restore, and shareable URLs.
