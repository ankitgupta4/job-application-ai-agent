from schemas import ResumeAnalysis


def _format_list(items: list[str]) -> str:
    if not items:
        return "- None"

    return "\n".join(
        f"- {item}" for item in items
    )


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
{analysis.recommendation.value}

## Confidence Score
{analysis.confidence_score}

## Overall Match Score
{analysis.overall_match_score}

## Skills Match
{analysis.skills_match_score}

## Experience Match
{analysis.experience_match_score}

## Career Direction Score
{analysis.career_direction_score}

## Fit Category
{analysis.fit_category.value}

## Role Alignment

{analysis.role_alignment}

## Strong Matches

{_format_list(analysis.strong_matches)}

## Transferable Matches

{_format_list(analysis.transferable_matches)}

## Missing Skills

{_format_list(analysis.missing_skills)}

## Learnable Gaps

{_format_list(analysis.learnable_gaps)}

## Serious Gaps

{_format_list(analysis.serious_gaps)}

## Deal Breakers

{_format_list(analysis.deal_breakers)}

## Matched Keywords

{_format_list(analysis.matched_keywords)}

## Missing Keywords

{_format_list(analysis.missing_keywords)}

## Reasoning

{analysis.reasoning}

## Application Strategy

{analysis.application_strategy}
"""
