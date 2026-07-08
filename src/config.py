import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

INPUT_FOLDER = "input"
OUTPUT_FOLDER = "output"

RESUME_FILE = os.path.join(INPUT_FOLDER, "resume.docx")
JD_FILE = os.path.join(INPUT_FOLDER, "job_description.txt")
CANDIDATE_PROFILE_FILE = os.path.join(INPUT_FOLDER, "candidate_profile.yaml")