# Job Agent

Job Agent is a local job-fit analysis tool. It compares a job description against:

- your resume
- your broader candidate profile
- the role/company context provided from the UI

It then returns a structured `APPLY`, `MAYBE`, or `SKIP` recommendation with fit scores, reasoning, strengths, transferable matches, gaps, and keywords.

The project currently has two parts:

```text
src/        Python backend, Gemini analysis, FastAPI API
frontend/  React + TypeScript + Vite frontend
```

## Current scope

This version implements Stage 1: job-fit decisioning.

It answers:

- Should I apply to this role?
- How strong is the match?
- Why was the recommendation made?
- What are the strong matches?
- Which gaps are learnable versus serious?
- Are there any deal breakers?

ATS gap analysis, resume tailoring, and cover letter generation are planned as later stages.

## Assumptions made

- The app is intended for local personal use.
- The backend uses a local resume file at `input/resume.docx`.
- The backend uses a local candidate profile file at `input/candidate_profile.yaml`.
- The frontend only uploads or accepts the job description text.
- The candidate profile and resume are private and should not be pushed to GitHub.
- The current analyzer is designed for Indian technology hiring context, where exact tech-stack matching is not always mandatory.
- Missing secondary tools should not automatically lead to `SKIP`.
- The decision stage is intentionally separate from ATS/resume-tailoring stages.
- `application_strategy` may be returned by the backend for future automation, but it is not shown on the current frontend page.

## Project structure

```text
Job_Agent/
├── src/
│   ├── api.py                 # FastAPI backend endpoint
│   ├── analyzer.py            # Gemini prompt and analysis call
│   ├── config.py              # File paths and environment loading
│   ├── file_manager.py        # Output file helpers for CLI flow
│   ├── gemini_client.py       # Gemini client setup
│   ├── jd_profile_reader.py   # JD and candidate profile readers
│   ├── main.py                # CLI/script flow
│   ├── resume_reader.py       # Resume .docx reader
│   ├── schemas.py             # Pydantic response schemas
│   └── summary_generator.py   # Markdown summary generator
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React UI
│   │   ├── main.tsx           # React entry point
│   │   ├── styles.css         # Tailwind/global styles
│   │   └── vite-env.d.ts      # Vite TypeScript environment types
│   ├── index.html             # Frontend HTML entry
│   ├── package.json           # Frontend dependencies/scripts
│   ├── package-lock.json      # Locked frontend dependency versions
│   ├── tsconfig.json          # TypeScript config
│   └── vite.config.ts         # Vite/Tailwind/React config
├── input/
│   └── .gitkeep               # Private input folder placeholder
├── output/
│   └── .gitkeep               # Generated output folder placeholder
├── .env.example               # Environment variable template
├── .gitignore
├── README.md
└── requirements.txt           # Backend dependencies
```

## Files that must stay local

The following files may contain private or sensitive information and should not be pushed:

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

The `.gitignore` is configured to keep these out of Git.

## Requirements

### Backend

- Python 3.10+
- Gemini API key
- Python packages from `requirements.txt`

### Frontend

- Node.js
- npm

Recommended Node version: use a current LTS version. Vite requires a modern Node runtime.

Check your versions:

```bash
python3 --version
node --version
npm --version
```

## Local setup

### 1. Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd Job_Agent
```

### 2. Create the environment file

```bash
cp .env.example .env
```

Open `.env` and set:

```env
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY
```

### 3. Add local private input files

Create or place these files locally:

```text
input/resume.docx
input/candidate_profile.yaml
```

The frontend will provide the job description, so `input/job_description.txt` is only required if you use the CLI/script flow through `src/main.py`.

### 4. Install backend dependencies

From the project root:

```bash
pip install -r requirements.txt
```

If you prefer a virtual environment:

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

Then return to the project root if needed:

```bash
cd ..
```

## Running locally

You need two terminals: one for the backend and one for the frontend.

### Terminal 1: Start the backend API

From the project root:

```bash
PYTHONPATH=src uvicorn api:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API docs are available at:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

### Terminal 2: Start the frontend

```bash
cd frontend
npm run dev
```

Frontend will usually run at:

```text
http://localhost:5173
```

## How it works

### Frontend flow

The frontend lets you provide:

- company name
- role title
- job description text, either pasted or uploaded as a `.txt` file

When you click `Analyze`, the frontend sends this request to the backend:

```http
POST /api/analyze
```

with data like:

```json
{
  "company": "Example Company",
  "role": "Senior AI Engineer",
  "job_description": "Full job description text..."
}
```

### Backend flow

The backend:

1. Reads `input/resume.docx`.
2. Reads `input/candidate_profile.yaml`.
3. Combines company, role, and JD text into a single job context.
4. Sends resume + candidate profile + job context to Gemini.
5. Parses the response into the `ResumeAnalysis` Pydantic schema.
6. Returns structured JSON to the frontend.

### Output shown on the frontend

The current UI shows:

- recommendation: `APPLY`, `MAYBE`, or `SKIP`
- confidence score
- overall match score
- skills match score
- experience match score
- career direction score
- fit category
- reasoning
- role alignment
- strong matches
- transferable matches
- learnable gaps
- serious gaps
- deal breakers
- missing skills
- matched keywords
- missing keywords

## Optional CLI/script flow

The original CLI/script flow still exists.

It expects:

```text
input/resume.docx
input/job_description.txt
input/candidate_profile.yaml
```

Run:

```bash
PYTHONPATH=src python3 src/main.py
```

It saves results under:

```text
output/<company>-<role>/
```

This includes:

```text
analysis.json
summary.md
original_jd.txt
```

## Useful checks before committing

### Backend syntax check

```bash
python3 -m py_compile src/api.py src/analyzer.py src/schemas.py src/main.py
```

### Frontend production build

```bash
cd frontend
npm run build
```

The generated `frontend/dist/` folder should not be committed.

### Git safety check

Before pushing:

```bash
git status --short
git status --ignored --short
```

Make sure these are not staged:

```text
.env
input/resume.docx
input/candidate_profile.yaml
input/job_description.txt
output/
frontend/node_modules/
frontend/dist/
frontend/tsconfig.tsbuildinfo
```

## Common issues

### `GEMINI_API_KEY not set`

Create `.env` from `.env.example` and set your API key:

```bash
cp .env.example .env
```

Then edit:

```env
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY
```

### Backend cannot find resume or profile

Ensure these files exist locally:

```text
input/resume.docx
input/candidate_profile.yaml
```

### Frontend cannot connect to backend

Make sure the backend is running:

```bash
PYTHONPATH=src uvicorn api:app --reload
```

The frontend expects the backend at:

```text
http://127.0.0.1:8000
```

If you need a different backend URL, create a frontend environment file later and set:

```env
VITE_API_BASE_URL=http://your-backend-url
```

### TypeScript build cache appears

`frontend/tsconfig.tsbuildinfo` is generated by TypeScript. It is ignored and should not be committed.

## Current limitations

- JD upload currently supports text-style upload only.
- Resume is read from local `input/resume.docx`; it is not uploaded through the UI yet.
- Candidate profile is read from local `input/candidate_profile.yaml`; it is not edited through the UI yet.
- ATS gap analysis is not implemented yet.
- Resume rewriting and cover letter generation are not implemented yet.
- The app is currently designed for local use, not public deployment.

## Planned next stages

Possible next improvements:

1. ATS gap analysis as a separate stage.
2. Resume tailoring suggestions.
3. Cover letter generation.
4. Upload resume from frontend.
5. Edit/manage candidate profile from frontend.
6. Save analysis history.
7. Export analysis as PDF or Markdown.
8. Add authentication if deployed publicly.

## Commit guidance

Recommended files to commit:

```text
.env.example
.gitignore
README.md
requirements.txt
src/
frontend/index.html
frontend/package.json
frontend/package-lock.json
frontend/tsconfig.json
frontend/vite.config.ts
frontend/src/
input/.gitkeep
output/.gitkeep
```

Do not commit:

```text
.env
input/resume.docx
input/job_description.txt
input/candidate_profile.yaml
output/*
frontend/node_modules/
frontend/dist/
*.tsbuildinfo
```
