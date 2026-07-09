# Job Agent

Job Agent is a local job-fit analysis tool. It compares a job description with your resume and candidate profile, then returns an `APPLY`, `MAYBE`, or `SKIP` recommendation with scores, reasoning, matches, gaps, and keywords.

The project has:

- Python/FastAPI backend in `src/`
- React + TypeScript + Vite frontend in `frontend/`

## Current scope

This version covers Stage 1: job-fit decisioning.

It answers:

- Should I apply?
- How strong is the fit?
- Why was the recommendation made?
- What are the strengths, transferable matches, learnable gaps, serious gaps, and deal breakers?

ATS gap analysis, resume tailoring, and cover letter generation are planned later.

## Assumptions

- The app is for local personal use.
- Resume is read from `input/resume.docx`.
- Candidate profile is read from `input/candidate_profile.yaml`.
- JD is entered or uploaded from the frontend.
- Private files like resume, profile, JD, `.env`, and outputs are not committed.
- The analyzer considers Indian hiring context, where exact tech-stack match is not always required.

## Setup

### 1. Clone repo

```bash
git clone <YOUR_REPO_URL>
cd Job_Agent
```

### 2. Create `.env`

```bash
cp .env.example .env
```

Set:

```env
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY
```

### 3. Add private input files

Create these locally:

```text
input/resume.docx
input/candidate_profile.yaml
```

`input/job_description.txt` is only needed for the old CLI flow.

### 4. Install backend dependencies

```bash
pip install -r requirements.txt
```

Optional virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

## Run locally

Use two terminals.

### Backend

From project root:

```bash
PYTHONPATH=src uvicorn api:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## How it works

1. User enters company, role, and JD in the frontend.
2. Frontend calls `POST /api/analyze`.
3. Backend reads local resume and candidate profile.
4. Backend sends resume + profile + JD context to Gemini.
5. Response is parsed into the `ResumeAnalysis` schema.
6. Frontend displays recommendation, scores, reasoning, matches, gaps, and keywords.

## Useful checks

Backend syntax check:

```bash
python3 -m py_compile src/api.py src/analyzer.py src/schemas.py src/main.py
```

Frontend production build:

```bash
cd frontend
npm run build
```

Git safety check:

```bash
git status --short
git status --ignored --short
```

Do not commit:

```text
.env
input/resume.docx
input/job_description.txt
input/candidate_profile.yaml
output/
frontend/node_modules/
frontend/dist/
*.tsbuildinfo
```

## Important files

```text
src/api.py              FastAPI API
src/analyzer.py         Gemini prompt and analysis logic
src/schemas.py          Pydantic response schema
src/resume_reader.py    Reads resume.docx
src/jd_profile_reader.py Reads JD/profile text
frontend/src/App.tsx    Main frontend UI
frontend/package.json   Frontend scripts/dependencies
```

## Next stages

- ATS gap analysis
- Resume tailoring suggestions
- Cover letter generation
- Resume upload from frontend
- Candidate profile editing from frontend
- Export analysis as PDF/Markdown
