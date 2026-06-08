from google.genai import types

from gemini_client import get_gemini_client

from schemas import ResumeAnalysis


def analyze_resume_against_jd(
    resume_text: str,
    jd_text: str
) -> ResumeAnalysis:

    prompt = f"""
You are an expert technical recruiter.

Analyze the resume against the job description.

Scoring Rules:
- Scores should be between 0 and 100
- Be conservative
- Do not inflate scores

Recommendation Rules:
- APPLY
- MAYBE
- SKIP

RESUME:
{resume_text}

JOB DESCRIPTION:
{jd_text}
"""
    client = get_gemini_client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ResumeAnalysis
        )
    )

    return response.parsed