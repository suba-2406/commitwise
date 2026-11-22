# CommitWise – GitHub Activity & Repository Intelligence Dashboard

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

CommitWise is a full-stack developer analytics platform that transforms raw GitHub repositories, commits, and public events into actionable developer intelligence, repository health audits, language breakdowns, and comparative benchmarks.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │        Client Web Browser            │
                      │  (React 18 + Vite + Tailwind CSS)    │
                      └──────────────────┬───────────────────┘
                                         │  HTTP / JSON (REST)
                                         ▼
                      ┌──────────────────────────────────────┐
                      │          FastAPI Backend             │
                      │  - CORS Middleware                   │
                      │  - Rate-Limit & Token Handling       │
                      │  - Response Schemas (Pydantic)       │
                      │  - Analytics Engine                  │
                      └──────────┬──────────────────┬────────┘
                                 │                  │
                SQLAlchemy ORM   │                  │  REST API Calls
                                 ▼                  ▼
              ┌─────────────────────┐    ┌─────────────────────┐
              │ SQLite / PostgreSQL │    │   GitHub REST API   │
              │ - Saved Profiles    │    │ - Profile & Repos   │
              │ - Snapshots         │    │ - Commits & Events  │
              └─────────────────────┘    └─────────────────────┘
```

---

## Key Features

1. **Executive Developer Profile & Health Audit**:
   - Comprehensive avatar, bio, follower metrics, account age, and active target indicators.
   - Algorithmic **Repository Health Score (0–100)** evaluating documentation coverage, open-source licensing, update recency, and original source ratio.
   - Automated **Developer Persona** assignment (e.g., *Community Star*, *Polyglot Engineer*, *Active Prolific Builder*).

2. **Stack & Language Intelligence**:
   - Donut and percentage distribution charts powered by Recharts.
   - Comprehensive language breadth counting and primary stack identification.

3. **Repository Explorer**:
   - Real-time client-side search across repository names and descriptions.
   - Filter by language ecosystem and source vs. fork status.
   - Sort by stars, forks, recent updates, or alphabetical order.

4. **Granular Commit Analytics**:
   - Interactive repository picker.
   - Day-of-week commit velocity and frequency charts.
   - Detailed commit log with SHA hashes, author avatars, and links to GitHub.

5. **Head-to-Head Developer Comparison**:
   - Side-by-side benchmarking of any two GitHub profiles.
   - Direct comparison charts for repositories, stars, forks, and followers.
   - Language overlap analysis identifying shared and unique tech stacks.

6. **Exportable Reports & Persisted Bookmarks**:
   - Real-time CSV report generation and download.
   - Clean, media-optimized printable and PDF report view.
   - Database bookmarking with one-click reload.

---

## Mandatory Design System & Palette

CommitWise implements a custom color palette avoiding generic blue SaaS templates:

| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Warm Ivory** | `#F5F0E8` | Light mode primary background & subtle tints |
| **Charcoal** | `#292D2C` | Sidebar navigation, dark theme base, strong text |
| **Terracotta** | `#D97745` | Primary action buttons, brand accents, commit highlights |
| **Sage Teal** | `#65A99B` | Health indicators, star metrics, positive trends |
| **Sand** | `#E8C99B` | Secondary highlights, forks, badges |
| **Muted Grey** | `#8A8D88` | Borders, subtle dividers, secondary labels |

*Supports seamless one-click toggling between Light and Dark themes.*

---

## Tech Stack

### Frontend
- **React 18** (SPA architecture)
- **Vite** (Next-generation lightning-fast bundler)
- **Tailwind CSS** (Custom theme configuration)
- **Recharts** (Declarative charts: Donut, Bar, Tooltips)
- **React Router v6** (Client-side routing)
- **Lucide React** (Consistent modern iconography)

### Backend
- **Python 3.10+**
- **FastAPI** (High-performance async web framework)
- **Requests & Pydantic** (Data extraction & schema validation)
- **SQLAlchemy** (Database ORM for SQLite & PostgreSQL)
- **Pytest** (Automated unit test suite)

---

## Installation & Local Development

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher & npm

### 1. Clone the Repository
```powershell
git clone https://github.com/subaja/commitwise.git
cd commitwise
```

### 2. Backend Setup
```powershell
# Navigate to backend directory
cd backend

# (Optional) Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# (Optional) Add GitHub Token for 5,000 req/hr rate limit
copy .env.example .env
# Edit .env and paste your GitHub personal access token

# Run unit tests
python test_api.py

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
*FastAPI documentation is available at:* `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
In a new terminal window:
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend will be running at:* `http://localhost:5173`

---

## Backend API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check and backend status |
| `GET` | `/github/{username}` | Developer profile with avatar, bio, and metadata |
| `GET` | `/github/{username}/repositories` | Repositories with stars, forks, and language |
| `GET` | `/github/{username}/{repo}/commits` | Recent commits with authors, SHAs, and messages |
| `GET` | `/github/{username}/statistics` | Aggregate stars, forks, and language stats |
| `GET` | `/github/{username}/activity` | Recent public event stream and weekday pattern |
| `GET` | `/github/{username}/languages` | Comprehensive language percentage breakdown |
| `GET` | `/github/{username}/insights` | Portfolio health score, persona, and active repos |
| `GET` | `/compare/{user1}/{user2}` | Head-to-head metrics and language overlap |
| `GET` | `/github/{username}/export/csv` | Downloadable CSV report |
| `GET` | `/api/saved-profiles` | List bookmarked developer profiles |
| `POST`| `/api/saved-profiles/{username}`| Bookmark a developer profile to database |
| `DELETE`| `/api/saved-profiles/{username}`| Remove a bookmarked developer profile |

---

## License

MIT License. See [LICENSE](LICENSE) for details.
