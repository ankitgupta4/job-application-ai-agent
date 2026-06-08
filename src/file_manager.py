import json
from pathlib import Path


def sanitize_name(text: str) -> str:
    """
    Convert company/role into folder-safe text.
    """

    invalid_chars = r'<>:"/\|?*'

    for char in invalid_chars:
        text = text.replace(char, "_")

    return text.strip().replace(" ", "_")


def create_job_folder(
    company: str,
    role: str,
    output_root: str = "output"
) -> Path:

    folder_name = (
        f"{sanitize_name(company)}-"
        f"{sanitize_name(role)}"
    )

    job_folder = Path(output_root) / folder_name

    job_folder.mkdir(
        parents=True,
        exist_ok=True
    )

    return job_folder


def save_json(
    data: dict,
    filepath: Path
):

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            indent=4,
            ensure_ascii=False
        )


def save_markdown(
    content: str,
    filepath: Path
):

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)


def save_text(
    content: str,
    filepath
):

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)