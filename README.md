# Kairos Studio // Precision Deadline Engine & Dynamic Lock Screen Generator

> **The anti-slop, reverse-engineering deadline command center and retina countdown lock screen generator.**  
> Built with Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript, and Vercel Edge Runtime.  
> 100% Client-Side First with Zero Configuration Required • Optional MongoDB Atlas Cloud Persistence • Universal AI Co-Pilot.

---

## ⚡ What Makes Kairos Studio Anti-Slop?

Most productivity and countdown applications suffer from "AI slop": low-effort purple gradient cards, illegible bubbly fonts, and static gimmicks that don't help you actually deliver.

**Kairos Studio** is engineered with a strict Swiss design philosophy:
1. **Precision Swiss & Monospaced Typography**: Tabular numerical clock alignments (`font-mono font-variant-numeric: tabular-nums`), clean hierarchical sans headings, and tactile hairline borders (`border-white/10`).
2. **True Native Retina Lock Screen Wallpapers**:
   - Custom HTML5 Canvas rasterization at true device pixel density (no fuzzy upscaling):
     - **iPhone 16 Pro / Pro Max**: `1179 × 2556 px`
     - **Samsung Galaxy S24 Ultra / Android**: `1080 × 2340 px`
     - **2K Desktop Monitor**: `2560 × 1440 px`
     - **4K Ultra HD Display**: `3840 × 2160 px`
   - Built-in Safe Area overlays for iPhone Dynamic Island and native lock screen clocks.
3. **Dynamic Edge Wallpaper Engine (`/api/wallpaper`)**:
   - Live server-rendered PNG endpoint powered by Vercel Edge Functions (`next/og`).
   - Automatically renders the exact countdown at the moment of request.
   - Native integration with **iOS Shortcuts Automation** to quietly refresh your phone's lock screen in the background every morning or upon charging.
4. **Reverse Milestone Pacing**:
   - Rather than just counting down, Kairos breaks your deadline backwards into 4 critical pacing checkpoints (25% Foundations, 60% Alpha Prototype, 85% Polish & Audit, 98% Final Staging).
5. **Universal AI Co-Pilot (`/api/ai/plan`)**:
   - Flexible server-side adapter supporting **Groq** (`llama-3.3-70b-versatile`), **OpenRouter** (Claude, Gemini, DeepSeek, etc.), **Google Gemini**, or **OpenAI**.
   - If no API key is provided, the app remains 100% functional with an instant **1-Click Copy Prompt** fallback.
6. **Live Fullscreen HUD & Web Audio Soundscapes**:
   - Dedicated distraction-free screen saver mode (`F` shortcut) for desk displays and docked devices.
   - Native Web Audio API procedural sound generators: Binaural 108Hz Drone, Brown Noise, Pink Noise, and Analog Clock Ticking (zero external audio file dependencies).
7. **Hybrid Persistence & Zero Vendor Lock-in**:
   - Works 100% offline out-of-the-box with browser `localStorage`.
   - Seamless auto-switch to MongoDB Atlas cloud database if `MONGODB_URI` is provided.
   - 1-Click JSON backup export/restore and compressed Base64 URL state sharing (`?share=...`).
   - RFC 5545 `.ics` iCalendar generator with 24-hour and 2-hour pre-deadline alarm notifications.

---

## 🎨 Aesthetic Archetypes

Kairos comes with 6 curated high-contrast themes:

| Theme | Inspiration | Dominant Palette |
| :--- | :--- | :--- |
| **Obsidian Swiss** | International Typographic Style | Deep titanium charcoal (`#09090b`), emerald accents, hairline white borders |
| **Cyber Telemetry** | Retro CRT terminal displays | Phosphor green (`#22c55e`), scanline grid, darkroom black (`#030806`) |
| **Twilight Aura** | Ambient glassmorphism | Deep royal violet (`#0d071c`), amber accents, frosted backdrop blurs |
| **Bauhaus Construct** | Weimar geometry | High-contrast stark monochrome, cardinal red (`#ef4444`) focal points |
| **Zen Sanctuary** | Minimalist organic calm | Deep forest slate (`#07140e`), mint accents (`#34d399`), tranquil pacing |
| **Custom Darkroom** | Multimodal photography | Upload your own background art with real-time blur and contrast-dimming sliders |

---

## 📱 Dynamic Live Wallpaper (Automated Phone Lock Screen)

To have your mobile lock screen automatically reflect your updated countdown every day without manually generating images:

```
https://<your-vercel-domain>/api/wallpaper?title=Thesis+Defense&targetDate=2026-12-31T00:00:00Z&theme=obsidian
```

### iPhone Automated Daily Refresh Setup (2 Minutes)
1. In your deployed Kairos Studio app, go to the **Wallpaper Studio** tab and click **"Auto-Update Guide"**.
2. Click **"Copy Dynamic Wallpaper URL"**.
3. On your iPhone, open the built-in **Shortcuts** app $\rightarrow$ tap **Automation** (bottom tab) $\rightarrow$ tap **+** (New Automation).
4. Choose a trigger:
   - **Time of Day** (e.g. `7:00 AM` every day), OR
   - **When Phone Connects to Power** (updates every time you plug in your phone).
   - Set to **Run Immediately** (disable *Ask Before Running*).
5. Add two actions:
   - Action 1: **"Get Contents of URL"** $\rightarrow$ paste your dynamic wallpaper URL.
   - Action 2: **"Set Wallpaper"** $\rightarrow$ select Lock Screen and toggle off *Show Preview*.
6. **Done.** Your iPhone will quietly pull the fresh countdown image from Vercel Edge and update your lock screen automatically.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15.1+](https://nextjs.org/) (App Router, Server Components, Edge API Routes)
- **Runtime**: Node.js 20+ / Vercel Edge Runtime (`next/og`)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom typography and tactile borders
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Procedural Web Audio API sound synthesis
- **Database (Optional)**: [MongoDB Atlas](https://www.mongodb.com/atlas) with serverless connection pooling
- **AI Engine**: Universal server-side provider (`src/lib/aiProvider.ts`) for Groq, OpenRouter, Gemini, and OpenAI
- **Testing**: Native Node.js automated verification suite (`scripts/test-all.mjs`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- `pnpm` (recommended), `npm`, or `yarn`

### 1. Clone & Install
```bash
git clone https://github.com/Escanor244/deadline-app.git
cd deadline-app
pnpm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Kairos Studio works 100% with zero environment variables configured. All keys are completely optional).*

### 3. Run Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
pnpm run build
pnpm run start
```

---

## 🧪 Automated Testing

Kairos includes an automated verification suite covering unit logic, encoding roundtrips, RFC 5545 calendar compliance, dynamic Edge wallpaper rendering, and API CRUD:

```bash
# Start your local server or specify a live deployment URL
pnpm run build
pnpm run start -p 3000

# In another terminal:
pnpm test
# or against a live URL:
TEST_BASE_URL=https://your-app.vercel.app node scripts/test-all.mjs
```

### What the Test Suite Verifies:
- **1. Time Math & Reverse Pacing**: Checks milliseconds calculation, positive days, hours, minutes, and expiration handling.
- **2. Reverse Milestone Engine**: Validates 4-checkpoint backward pacing and strict chronological distribution.
- **3. RFC 5545 .ICS Calendar**: Validates `BEGIN:VCALENDAR`, `VEVENT`, `-PT24H`, and `-PT2H` audio/visual alarms.
- **4. URL State Encoding Roundtrip**: Validates lossless Base64 URL compression of title, category, and date.
- **5. Wallpaper Device Matrix**: Verifies pixel dimensions for iPhone 16 Pro, Samsung S24 Ultra, and 4K Desktop.
- **6. Live Edge API & CRUD**:
  - `GET /api/deadlines/status` (Health & database state)
  - `GET /api/deadlines` (Hybrid fetch)
  - `POST /api/deadlines` (Persistence)
  - `DELETE /api/deadlines` (Cleanup)
  - `GET /api/wallpaper` (Dynamic Edge PNG generator, MIME type, binary payload)
  - `POST /api/ai/plan` (Universal AI co-pilot and graceful 1-click fallback prompt)
  - `GET /` (Clean HTML verification, zero meta contest references, brand integrity)

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default / Example | Required? |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas serverless connection string | `mongodb+srv://...` | Optional (falls back to LocalStorage) |
| `MONGODB_DB` | Database name | `kairos_studio` | Optional |
| `GROQ_API_KEY` | Ultra-fast Groq API Key | `gsk_...` | Optional |
| `GROQ_MODEL` | Model for Groq co-pilot | `llama-3.3-70b-versatile` | Optional |
| `OPENROUTER_API_KEY` | OpenRouter Key (Claude, DeepSeek, Gemini) | `sk-or-v1-...` | Optional |
| `OPENROUTER_MODEL` | OpenRouter model identifier | `meta-llama/llama-3.3-70b-instruct` | Optional |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` | Optional |
| `GEMINI_MODEL` | Gemini model identifier | `gemini-2.5-flash` | Optional |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-...` | Optional |
| `OPENAI_MODEL` | OpenAI model identifier | `gpt-4o-mini` | Optional |

---

## 🌐 Deploying to Vercel (1-Click)

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add any optional keys you want (e.g., `MONGODB_URI`, `OPENROUTER_API_KEY`, etc.).
4. Click **Deploy**. Vercel will build and host your edge functions and web dashboard with zero additional configuration.

---

## 📄 License
MIT License. Built for focused creators, researchers, engineers, and students who ship on time.
