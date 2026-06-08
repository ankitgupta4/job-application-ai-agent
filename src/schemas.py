from enum import Enum

from pydantic import BaseModel


class Recommendation(str, Enum):

    APPLY = "APPLY"
    MAYBE = "MAYBE"
    SKIP = "SKIP"


class ResumeAnalysis(BaseModel):

    overall_match_score: int

    skills_match_score: int

    experience_match_score: int

    strong_matches: list[str]

    missing_skills: list[str]

    gaps: list[str]

    matched_keywords: list[str]

    missing_keywords: list[str]

    recommendation: Recommendation

    reasoning: str