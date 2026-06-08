from pprint import pprint

from config import RESUME_FILE
from config import JD_FILE

from resume_reader import read_resume
from jd_reader import read_job_description

from analyzer import analyze_resume_against_jd

from file_manager import save_text

from file_manager import (
    create_job_folder,
    save_json,
    save_markdown
)

from summary_generator import generate_summary


def main():

    resume_text = read_resume(RESUME_FILE)

    jd_data = read_job_description(JD_FILE)

    analysis = analyze_resume_against_jd(
        resume_text,
        jd_data["full_text"]
    )

    pprint(
        analysis.model_dump()
    )

    job_folder = create_job_folder(
        company=jd_data["company"],
        role=jd_data["role"]
    )

    save_json(
        analysis.model_dump(),
        job_folder / "analysis.json"
    )

    summary = generate_summary(
        analysis,
        jd_data["company"],
        jd_data["role"]
    )

    save_markdown(
        summary,
        job_folder / "summary.md"
    )

    save_text(
    jd_data["full_text"],
    job_folder / "original_jd.txt"
)

    print(
        f"\nSaved results to: {job_folder}"
    )


if __name__ == "__main__":
    main()