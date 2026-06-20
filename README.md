# AI Resume Analyzer

A premium, dashboard-style web app that analyzes resumes using the **Gemini 3.5 Flash** API. Upload a PDF or paste text, optionally add a job description, and get an instant score breakdown with actionable improvements.

![Dashboard Preview](./public/favicon.svg)

## Features

- **Drag-and-drop PDF upload** — client-side text extraction via `pdfjs-dist`
- **Overall Score gauge** — animated SVG radial fill
- **5-category radar chart** — ATS, Keywords, Formatting, Impact, Clarity
- **Strengths & Improvements** — specific, not generic
- **Missing keywords** — dismissible chip tags
- **Bullet point rewrite** — before/after diff with AI
- **PDF report download** — `html2canvas` + `jsPDF`
- **Skeleton loaders** — no blank screens
- **Toast error handling** — every failure path covered

---

## Local Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ai-resume-analyzer
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Open `.env.local` and set your key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com/apikey).

### 3. Run Development Server

You need **two terminals** (or use the combined command):

**Option A — Combined (recommended):**
```bash
npm run dev:full
```

**Option B — Separate terminals:**
```bash
# Terminal 1: API server (port 3001)
npm run server

# Terminal 2: Vite frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
ai-resume-analyzer/
├── api/
│   └── analyze.js          # Vercel serverless function
├── src/
│   ├── components/
│   │   ├── UploadSection.jsx
│   │   ├── ScoreGauge.jsx
│   │   ├── RadarBreakdown.jsx
│   │   ├── StrengthsCard.jsx
│   │   ├── ImprovementsCard.jsx
│   │   ├── KeywordChips.jsx
│   │   ├── BulletRewriteDiff.jsx
│   │   ├── SkeletonLoader.jsx
│   │   └── TopBar.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server.js               # Local Express dev server
├── .env.example
├── .env.local              # ← gitignored, add your key here
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted:
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

### Option B — GitHub Integration

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repo
4. Vercel auto-detects Vite + `/api` serverless functions

### Set Environment Variable on Vercel

In the Vercel dashboard → **Project Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | `your_actual_key` |

> ⚠️ **Never** commit `.env.local` or expose the key in frontend code. The key is only read in `api/analyze.js` via `process.env`.

---

## Verification Checklist

- [ ] `npm run dev:full` — upload flow works end to end
- [ ] Upload valid PDF → extracted text is non-empty
- [ ] Upload `.docx` → toast error, no crash
- [ ] Submit empty resume → client-side toast blocks request
- [ ] Paste >15,000 characters → 400 response, toast shown
- [ ] Unset `GEMINI_API_KEY` → 500 response, toast (no key leak)
- [ ] `vercel --prod` → live URL, full flow tested

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Charts | Recharts |
| Animations | Framer Motion |
| PDF parsing | pdfjs-dist (client-side) |
| PDF export | jsPDF + html2canvas |
| Backend | Vercel Serverless (Node.js) |
| AI | Google Gemini 3.5 Flash |
| Toasts | react-hot-toast |
