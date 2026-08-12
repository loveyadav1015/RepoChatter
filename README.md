# Repo Chatter 🚀

> **Chat with any GitHub repository's README using AI-powered RAG — wrapped in a
> cinematic, monochrome interface.**

Repo Chatter lets developers paste a public GitHub repository URL and instantly ask
natural-language questions about its README — grounded strictly in the actual
documentation, with source citations. It tracks repository commit activity in the
background via a scheduled job, and presents it all through a custom black-and-white
interface with a cursor-reactive glow and an illustrated scroll-triggered landing hero.

Built as a submission for **OverEngineered** — the Web Development Wing selection process.

---

## 🎯 Features

- **📚 Add Any Public Repo** — paste a GitHub URL, README is fetched and indexed automatically
- **💬 Grounded Q&A** — ask questions in plain English, get answers based strictly on the README (no hallucination — the model explicitly refuses to answer outside the provided context)
- **📍 Source Citations** — every answer shows exactly which README chunks were used
- **📊 Commit Activity Tracking** — hourly cron job fetches and paginates through recent commits per tracked repo
- **🎨 Signature Cursor Glow** — a soft white light follows the cursor across the black interface, with a stronger localized glow on interactive cards/buttons
- **🎬 Illustrated Scroll Hero** — page loads with a giant wordmark; scrolling smoothly reveals a hand-drawn-style hand holding a phone mockup with the real "add repo" form inside, via GSAP ScrollTrigger
- **🔤 Editorial Typography** — serif display font (Fraunces) for identity/headline moments, clean sans-serif (Inter) for UI, monospace (JetBrains Mono) for technical data
- **🐳 Fully Dockerized** — one-command local startup for backend, frontend, and database
- **☁️ Deployed** — frontend on Netlify, backend + database on Render

---

## 🏗️ Architecture

```
┌──────────────┐         ┌──────────────┐         ┌─────────────┐
│   React      │◄───────►│   Express    │◄───────►│ PostgreSQL  │
│  (Vite +     │  REST   │   Backend    │   pg     │ + pgvector  │
│  shadcn/ui)  │         │              │          │             │
└──────────────┘         └──────┬───────┘         └─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
        ┌─────▼─────┐    ┌───────▼──────┐   ┌───────▼──────┐
        │  GitHub    │    │ HuggingFace  │   │    Groq      │
        │  REST API  │    │  Embeddings  │   │ (Mixtral     │
        │            │    │  (384-dim)   │   │  8x7B LLM)   │
        └────────────┘    └──────────────┘   └──────────────┘
              │
      ┌───────▼────────┐
      │  node-cron Job  │
      │ (hourly commit  │
      │    polling,     │
      │   paginated)    │
      └─────────────────┘
```

### Request Flow

1. **User adds a repo** → backend fetches README from the GitHub REST API
2. **Chunking** → README split into fixed-size chunks (~500 chars each)
3. **Embedding** → each chunk embedded via HuggingFace (`all-MiniLM-L6-v2`, 384 dimensions)
4. **Storage** → chunks + vectors stored in PostgreSQL (`repo_chunks`, pgvector column, exact k-NN search)
5. **User asks a question** → question embedded, top-5 chunks retrieved via cosine similarity
6. **Generation** → question + retrieved chunks sent to Groq (Mixtral 8x7B), grounded answer generated
7. **Response** → answer + source chunk citations returned to frontend, logged to `chat_history`
8. **Cron job** → every hour, fetches new commits per tracked repo (paginated, up to 100 most recent), inserts into `commit_logs`, updates `commit_count`

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) — UI framework
- **shadcn/ui** — component library (Button, Card, Input, Skeleton, Badge, Sonner)
- **GSAP** (+ ScrollTrigger) — scroll-driven hero animation and micro-interactions
- **React Router** — client-side routing
- **Axios** — HTTP client
- **Tailwind CSS** — styling, required by shadcn/ui

### Backend
- **Node.js + Express** (ESM) — REST API, layered architecture (routes → controllers → services)
- **`pg`** — raw PostgreSQL driver
- **node-cron** — scheduled job runner

### Database
- **PostgreSQL 16** with **pgvector** extension
- Exact k-NN similarity search (approximate `ivfflat` indexing was tried and removed — see [Known Issues](#-known-issues--design-decisions))

### External APIs
- **GitHub REST API** — README + paginated commit history
- **HuggingFace Inference API** — free embeddings (`sentence-transformers/all-MiniLM-L6-v2`, 384-dim)
- **Groq API** — fast LLM inference (Mixtral 8x7B) for grounded answer generation

### Infrastructure
- **Docker + Docker Compose** — full local stack (`db`, `backend`, `frontend` services)
- **Netlify** — frontend hosting (static build)
- **Render** — backend (Web Service) + PostgreSQL (with pgvector) hosting

---

## 📋 Prerequisites

### For local (non-Docker) development
- Node.js 18+
- PostgreSQL 12+ with pgvector extension available

### For Docker development
- Docker + Docker Compose (nothing else needed locally — Postgres runs in a container)

### API keys (required either way)
- **GitHub Personal Access Token** — https://github.com/settings/tokens (`public_repo` scope)
- **HuggingFace API Token** — https://huggingface.co/settings/tokens
- **Groq API Key** — https://console.groq.com/keys

---

## 🚀 Quick Start (Docker — Recommended)

```bash
git clone <this-repo-url>
cd web

cp .env.example .env
# edit .env with your real API keys

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Database migrations run automatically on first start

---

## 🚀 Quick Start (Manual, No Docker)

### 1. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Database setup
```bash
createdb repo_chatter
psql repo_chatter -c "CREATE EXTENSION IF NOT EXISTS vector;"

psql repo_chatter -f database/migrations/001_init_tracked_repos.sql
psql repo_chatter -f database/migrations/002_init_repo_chunks.sql
psql repo_chatter -f database/migrations/003_init_commit_logs.sql
psql repo_chatter -f database/migrations/004_init_chat_history.sql
```

### 3. Environment variables

**`backend/.env`:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/repo_chatter
GITHUB_API_TOKEN=ghp_xxxxx
EMBEDDING_API_KEY=hf_xxxxx
GROQ_API_KEY=gsk_xxxxx
PORT=4000
```

**`frontend/.env`:**
```
VITE_API_URL=http://localhost:4000
```

### 4. Run
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open `http://localhost:5173`.

---

## 📚 API Reference

| Method | Endpoint | Description |
|--------|----------|--------------|
| `POST` | `/api/repos` | Add a repository — body: `{ repoUrl }` |
| `GET` | `/api/repos` | List all tracked repositories |
| `GET` | `/api/repos/:id` | Get repo details + recent commits |
| `DELETE` | `/api/repos/:id` | Stop tracking a repository (cascades) |
| `POST` | `/api/repos/:id/chat` | Ask a question — body: `{ question }` |
| `GET` | `/api/health` | Health check |

**Field naming:** the backend uses raw `pg` with snake_case columns (`repo_name`,
`commit_count`, `readme_content`) — not camelCase. The frontend is built expecting this.

### Example: Chat Endpoint

```bash
curl -X POST http://localhost:4000/api/repos/<repo_id>/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I install this?"}'
```

```json
{
  "answer": "To install this repository, follow these steps: 1. Clone...",
  "sourceChunkIds": ["a0085122-...", "d22c7da9-...", "..."],
  "sourceChunkTexts": ["## Setup\n### Prerequisites...", "..."]
}
```

If the question isn't covered by the README, the model correctly refuses:
```json
{
  "answer": "I don't know, this isn't covered in the README.",
  "sourceChunkIds": [...],
  "sourceChunkTexts": [...]
}
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `tracked_repos` | Repo metadata — URL, owner, cached README, fetch/embed timestamps, commit count |
| `repo_chunks` | README chunks + 384-dim pgvector embeddings |
| `commit_logs` | Commit activity fetched by the cron job — unique constraint on `(repo_id, commit_hash)` prevents duplicates |
| `chat_history` | Q&A log with source chunk citations |

---

## 🔄 RAG Pipeline in Detail

```
README text (fetched from GitHub)
        │
        ▼
  chunkText() — fixed-size chunks, ~500 chars each
        │
        ▼
  embed() per chunk — HuggingFace all-MiniLM-L6-v2, 384-dim vectors
        │
        ▼
  stored in repo_chunks (pgvector column)

─────────────────────────────────────────

User question
        │
        ▼
  embed(question) — same 384-dim embedding model
        │
        ▼
  retrieveTopChunks() — pgvector cosine distance (<=>), exact k-NN, top 5
        │
        ▼
  generateGroundedAnswer() — chunks + question → Groq (Mixtral 8x7B)
        │
        ▼
  answer + sourceChunkIds + sourceChunkTexts returned, logged to chat_history
```

---

## 🕐 Scheduled Jobs

**Hourly cron job** (`backend/src/jobs/scheduler.js`):
- For each tracked repo, fetches commits newer than `last_fetched` from GitHub
- Paginates up to 100 commits per fetch (GitHub API, 100/page max) — on first ingestion,
  fetches full recent history; subsequent runs fetch only new commits incrementally
- Inserts new rows into `commit_logs`, skipping duplicates via `ON CONFLICT DO NOTHING`
  on `(repo_id, commit_hash)`
- Updates `tracked_repos.commit_count` and `last_fetched` after each run

---

## 🎨 Design System

Full design specification lives in `artifact/STYLE.md` and
`artifact/STYLE-LANDING-HERO.md`. Summary:

### Color
- Background: pure black (`#000000`)
- Text: white (primary), gray (secondary/muted)
- The ONLY accent colors: red (errors), green (success) — everything else is grayscale
- Landing hero adds one exception: warm cream tone for the illustrated hand and phone screen

### Typography
- **Fraunces** (serif) — headline/identity moments only: hero title, repo card names
- **Inter** (sans-serif) — everything functional: buttons, inputs, body text
- **JetBrains Mono** — technical/numeric data: commit counts, source citations

### Signature Interactions
1. **Cursor glow** — a soft ambient white radial glow follows the mouse across the
   entire app (disabled on touch devices, respects `prefers-reduced-motion`); a
   stronger, localized glow appears on primary cards/buttons on hover
2. **Scroll-triggered hero reveal** — on page load, a giant "CHATTER" wordmark fills the
   screen; scrolling pins the hero section and smoothly transitions the wordmark to a
   small background element while a simple illustrated hand+phone mockup scales in from
   behind it, revealing the real, functional repo-add form inside the phone screen

---

## 🎬 Landing Page Hero

The landing page opens with a full-viewport illustrated composition:
- A giant wordmark ("CHATTER") rendered in Fraunces
- A simplified SVG hand (flat, geometric, cream-colored — not photorealistic) appearing
  to hold a phone mockup
- White hand-drawn-style doodle squiggles scattered in the negative space
- GSAP ScrollTrigger drives a scroll-scrubbed transition: as the user scrolls, the
  wordmark shrinks to the background and the hand+phone scale into view, revealing the
  actual `AddRepoForm` component inside the phone's screen — fully functional, not a
  static mockup image

This reuses the same `AddRepoForm` component (and its real `POST /api/repos` call) used
elsewhere in the app — the phone mockup is a styled wrapper around real functionality,
not a decorative duplicate.

---

## 🐳 Docker

```bash
docker compose up --build
```

Services:
- `db` — `pgvector/pgvector:pg16`, auto-runs migrations on first start via
  `database/docker-init.sh`
- `backend` — Express, connects to Postgres via the `db` service hostname (not
  `localhost` — a common Docker networking mistake avoided here)
- `frontend` — multi-stage build (Vite build → served via nginx), with an `nginx.conf`
  rewrite rule so client-side routing (`/repos/:id`) doesn't 404 on refresh

**Note:** `VITE_API_URL` is a Vite build-time variable — it's baked into the static
bundle when the frontend image is built, not read at container runtime. Changing it
requires rebuilding the frontend image.

See `docker-compose.yml` and each service's `Dockerfile` for full configuration.

---

## ☁️ Deployment

- **Frontend:** Netlify (static build from `frontend/`, with a `_redirects` file for SPA routing)
- **Backend:** Render Web Service (`backend/`, `node server.js`, reads `process.env.PORT`)
- **Database:** Render PostgreSQL, with pgvector manually enabled post-creation

Full step-by-step deployment instructions, including CORS configuration and common
deployment pitfalls (CORS errors, pgvector setup, free-tier cold starts), are documented
separately for the deployment pass of this project.

**Key gotchas:**
- Backend CORS must explicitly allow the deployed Netlify URL, or the browser will show
  "Network Error" even though the backend itself works fine (verifiable via curl)
- Render's free tier spins down after inactivity — first request after idle takes 30-60s
- pgvector extension must be manually enabled on Render's managed Postgres

---

## ⚠️ Known Issues / Design Decisions

Real bugs encountered and resolved during development — documented here because
they're genuinely instructive (see `artifact/project.md` for full writeups):

### 1. Embedding provider migration caused silent retrieval failures
Switched embedding providers mid-project (OpenAI, 1536-dim → HuggingFace, 384-dim) to
avoid API costs. Repos ingested before the switch had incompatible vector dimensions,
causing the chat endpoint to silently return "I don't have enough context" with no
visible error. **Fixed** by re-ingesting affected repos and adding a startup safeguard
(`verifyEmbeddingDimensionMatch()`) that fails fast if the live embedding provider's
output dimension ever diverges from the database schema.

### 2. `ivfflat` index returned empty results on small datasets
pgvector's `ivfflat` approximate index with `lists=100` divided the vector space into
100 clusters; with fewer than 100 rows, most clusters were empty, so approximate search
silently returned zero results. **Fixed** by removing the index and using exact k-NN
scan — correct and fast at this project's scale.

### 3. README ingestion wasn't awaited
The repo-creation endpoint didn't `await` the README ingestion step, so the API
responded before chunking/embedding completed, leaving `readme_content` null. **Fixed**
by properly awaiting ingestion and surfacing any errors in the API response.

### 4. Commit count capped at ~20 per repo
GitHub's commits endpoint defaults to a single page if pagination isn't explicitly
handled. **Fixed** by paginating through up to 100 most recent commits on first
ingestion, then fetching only new commits incrementally on each cron run.

---

## 🔒 Security Considerations

- API keys loaded via `.env`, never committed (`.gitignore` excludes `.env`)
- GitHub requests authenticated to avoid the 60 req/hour unauthenticated rate limit
- Parameterized SQL queries throughout — no string-concatenated queries
- CORS restricted to known frontend origins only
- **Not yet implemented:** user authentication (single-implicit-user MVP scope)

---

## 📈 Future Enhancements

- [ ] User authentication and per-user repo ownership
- [ ] Multi-repo chat (ask across several repos at once)
- [ ] Index additional docs/source files, not just README
- [ ] Persist chat history across page refreshes (currently in-memory per session)
- [ ] Reranking retrieved chunks for improved relevance on ambiguous questions
- [ ] Reverse proxy + HTTPS + proper secrets management for production Docker deployment

---

## 📖 Project Context

Built for **OverEngineered**, the project-based selection process for the Web
Development Wing. Demonstrates:

- Full-stack development (React + Express)
- Database design with PostgreSQL + pgvector
- A RAG pipeline built from scratch — chunking, embedding, retrieval, generation
- Multiple external API integrations (GitHub, HuggingFace, Groq)
- Scheduled background jobs (node-cron)
- A distinctive, deliberate frontend design system (not default/templated)
- Containerization (Docker) and real deployment (Netlify + Render)
- Real debugging of non-obvious production bugs — dimension mismatches, ANN indexing
  behavior, pagination, async/await ordering — documented with root cause and resolution

---

## 📁 Project Structure

```
web/
├── artifact/
│   ├── project.md              # architecture decisions, challenges faced
│   ├── STYLE.md                # base design system (color, glow, typography)
│   └── STYLE-LANDING-HERO.md   # landing page illustration spec
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/external/  # github, groq, embeddings adapters
│   │   ├── rag/                # ingest, embed, retrieve, generate
│   │   ├── jobs/                # cron scheduler
│   │   ├── db/
│   │   └── config/
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/        # hero wordmark, hand SVG, phone mockup, doodles
│   │   │   └── ui/              # shadcn-generated components
│   │   ├── pages/
│   │   ├── hooks/                # cursor glow, GSAP reveals
│   │   └── services/
│   ├── nginx.conf
│   └── Dockerfile
├── database/
│   ├── migrations/
│   └── docker-init.sh
├── docker-compose.yml
└── README.md
```

---

## 📄 License

MIT

---

**Built with Node.js, Express, React, PostgreSQL + pgvector, shadcn/ui, GSAP, Docker,
and a lot of debugging.** 🎬