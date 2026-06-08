from schemas import ResumeAnalysis


def generate_summary(
    analysis: ResumeAnalysis,
    company: str,
    role: str
) -> str:

    return f"""
# Resume Analysis

## Company
{company}

## Role
{role}

## Recommendation
{analysis.recommendation}

## Overall Match Score
{analysis.overall_match_score}

## Skills Match
{analysis.skills_match_score}

## Experience Match
{analysis.experience_match_score}

## Strong Matches

{chr(10).join(f"- {item}" for item in analysis.strong_matches)}

## Missing Skills

{chr(10).join(f"- {item}" for item in analysis.missing_skills)}

## Gaps

{chr(10).join(f"- {item}" for item in analysis.gaps)}

## Missing Keywords

{chr(10).join(f"- {item}" for item in analysis.missing_keywords)}

## Reasoning

{analysis.reasoning}
"""