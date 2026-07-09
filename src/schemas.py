from enum import Enum

from pydantic import BaseModel


class FitCategory(str, Enum):
    STRONG = "STRONG"
    MODERATE = "MODERATE"
    STRETCH = "STRETCH"
    WEAK = "WEAK"

class Recommendation(str, Enum):

    APPLY = "APPLY"
    MAYBE = "MAYBE"
    SKIP = "SKIP"

class ResumeAnalysis(BaseModel):
    recommendation: Recommendation
    confidence_score: int
    overall_match_score: int
    skills_match_score: int
    experience_match_score: int
    career_direction_score: int

    fit_category: FitCategory

    strong_matches: list[str]
    transferable_matches: list[str]
    missing_skills: list[str]
    learnable_gaps: list[str]
    serious_gaps: list[str]
    deal_breakers: list[str]

    matched_keywords: list[str]
    missing_keywords: list[str]

    role_alignment: str
    reasoning: str
    application_strategy: str