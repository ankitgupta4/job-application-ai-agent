from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from analyzer import analyze_resume_against_jd
from config import CANDIDATE_PROFILE_FILE
from config import RESUME_FILE
from jd_profile_reader import read_candidate_profile
from resume_reader import read_resume
from schemas import ResumeAnalysis
from summary_generator import generate_summary


class AnalyzeRequest(BaseModel):
    company: str = ""
    role: str = ""
    job_description: str


class AnalyzeResponse(BaseModel):
    company: str
    role: str
    analysis: ResumeAnalysis
    summary_markdown: str


app = FastAPI(
    title="Job Agent API",
    description="Analyze JD fit using resume, candidate profile, and Gemini.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok"
    }


@app.post(
    "/api/analyze",
    response_model=AnalyzeResponse
)
def analyze_job(request: AnalyzeRequest) -> AnalyzeResponse:
    company = request.company.strip() or "Unknown Company"
    role = request.role.strip() or "Unknown Role"
    jd_text = request.job_description.strip()

    if not jd_text:
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    jd_context = f"""
COMPANY: {company}
ROLE: {role}

JOB DESCRIPTION:
{jd_text}
"""

    try:
        resume_text = read_resume(RESUME_FILE)
        candidate_profile_text = read_candidate_profile(
            CANDIDATE_PROFILE_FILE
        )

        analysis = analyze_resume_against_jd(
            resume_text,
            jd_context,
            candidate_profile_text
        )

        summary_markdown = generate_summary(
            analysis,
            company,
            role
        )

        return AnalyzeResponse(
            company=company,
            role=role,
            analysis=analysis,
            summary_markdown=summary_markdown
        )

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Required input file missing. Ensure input/resume.docx and "
                "input/candidate_profile.yaml exist."
            )
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc
