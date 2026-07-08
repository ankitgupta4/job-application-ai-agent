def read_job_description(file_path: str):

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.splitlines()

    company = ""
    role = ""

    for line in lines:

        if line.startswith("COMPANY:"):
            company = line.replace("COMPANY:", "").strip()

        elif line.startswith("ROLE:"):
            role = line.replace("ROLE:", "").strip()

    return {
        "company": company,
        "role": role,
        "full_text": content
    }

def read_candidate_profile(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()